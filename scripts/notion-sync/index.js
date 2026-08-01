// scripts/notion-sync/index.js
//
// 노션 데이터베이스에서 "상태 = 완료" 이면서 "동기화됨 = false" 인 페이지를 찾아
// 페이지 본문(blocks)을 마크다운으로 변환한 뒤 "제목-날짜.md" 파일로 저장하고,
// 성공한 페이지는 노션 쪽 "동기화됨" 체크박스를 true로 업데이트합니다.
//
// 필요한 환경변수:
//   NOTION_TOKEN        - 노션 Integration Secret
//   NOTION_DATABASE_ID  - 노션 데이터베이스 ID
//   OUTPUT_DIR          - (선택) 저장할 폴더, 기본값 "notion-sync"
//
// 속성 이름이 다르면 아래 PROPERTY_NAMES 부분만 수정하면 됩니다.

const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const OUTPUT_DIR = process.env.OUTPUT_DIR || "notion-sync";

// ---- 노션 속성 이름 (다르면 여기만 수정) ----
const PROPERTY_NAMES = {
  title: "제목",
  date: "날짜",
  status: "상태",
  statusDoneValue: "완료",
  synced: "동기화됨",
};

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("NOTION_TOKEN / NOTION_DATABASE_ID 환경변수가 필요합니다.");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

// 파일명으로 못 쓰는 문자 제거
function sanitizeForFilename(text) {
  return String(text)
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ");
}

function getTitle(page) {
  const prop = page.properties[PROPERTY_NAMES.title];
  if (!prop || !prop.title || prop.title.length === 0) return "제목없음";
  return prop.title.map((t) => t.plain_text).join("");
}

function getDate(page) {
  const prop = page.properties[PROPERTY_NAMES.date];
  if (!prop || !prop.date || !prop.date.start) return "날짜없음";
  return prop.date.start.slice(0, 10); // YYYY-MM-DD
}

async function findDonePages() {
  const results = [];
  let cursor = undefined;

  do {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      filter: {
        and: [
          {
            property: PROPERTY_NAMES.status,
            select: { equals: PROPERTY_NAMES.statusDoneValue },
          },
          {
            property: PROPERTY_NAMES.synced,
            checkbox: { equals: false },
          },
        ],
      },
    });
    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return results;
}

async function pageToMarkdownBody(pageId) {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdBlocks);
  return mdString.parent || "";
}

async function markSynced(pageId) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [PROPERTY_NAMES.synced]: { checkbox: true },
    },
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const pages = await findDonePages();
  console.log(`동기화 대상 페이지: ${pages.length}개`);

  let successCount = 0;

  for (const page of pages) {
    const title = getTitle(page);
    const date = getDate(page);

    try {
      const body = await pageToMarkdownBody(page.id);

      const frontmatter = [
        "---",
        `title: "${title.replace(/"/g, '\\"')}"`,
        `date: ${date}`,
        `notion_page_id: ${page.id}`,
        "---",
        "",
      ].join("\n");

      const filename = `${sanitizeForFilename(title)}-${sanitizeForFilename(date)}.md`;
      const filepath = path.join(OUTPUT_DIR, filename);

      fs.writeFileSync(filepath, frontmatter + body, "utf8");
      console.log(`저장 완료: ${filepath}`);

      await markSynced(page.id);
      console.log(`노션 동기화됨 체크 완료: ${title}`);

      successCount += 1;
    } catch (err) {
      console.error(`실패 (${title} / ${date}):`, err.message);
      // 한 페이지 실패해도 나머지는 계속 진행
    }
  }

  console.log(`총 ${successCount}개 파일 생성/업데이트 완료`);
}

main().catch((err) => {
  console.error("스크립트 실행 중 오류:", err);
  process.exit(1);
});
