// scripts/notion-sync/index.js
//
// 노션 데이터베이스에서 "상태 = 완료" 이면서 "깃허브 동기화 = false" 인 페이지를 찾아
// 페이지 본문(blocks)을 마크다운으로 변환한 뒤 "제목-날짜.md" 파일로 저장하고,
// 성공한 페이지는 노션 쪽 "깃허브 동기화" 체크박스를 true로 업데이트합니다.
// 또한 새로 추가된 파일들의 링크를 README.md에 "날짜 - 제목" 형태로 추가합니다.
//
// 이 스크립트는 저장소 루트(repo root)에서 실행된다고 가정합니다.
// (워크플로에서 `node scripts/notion-sync/index.js` 형태로 실행)
//
// 필요한 환경변수:
//   NOTION_TOKEN        - 노션 Integration Secret
//   NOTION_DATABASE_ID  - 노션 데이터베이스 ID
//   OUTPUT_DIR          - (선택) 저장할 폴더, 기본값 "study-notes" (저장소 루트 기준)
//   README_PATH         - (선택) README 경로, 기본값 "README.md" (저장소 루트 기준)
//
// 속성 이름이 다르면 아래 PROPERTY_NAMES 부분만 수정하면 됩니다.

const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const OUTPUT_DIR = process.env.OUTPUT_DIR || "study-notes";
const README_PATH = process.env.README_PATH || "README.md";

const SYNC_LIST_START = "<!-- NOTION_SYNC_LIST_START -->";
const SYNC_LIST_END = "<!-- NOTION_SYNC_LIST_END -->";

// ---- 노션 속성 이름 (다르면 여기만 수정) ----
const PROPERTY_NAMES = {
  title: "제목",
  date: "날짜",
  status: "상태",
  statusDoneValue: "완료",
  synced: "깃허브 동기화",
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

// README.md에 "날짜 - [제목](경로)" 형태의 링크 목록을 추가
function updateReadme(newLines) {
  if (newLines.length === 0) return;

  let content;
  if (fs.existsSync(README_PATH)) {
    content = fs.readFileSync(README_PATH, "utf8");
  } else {
    content = "";
  }

  if (!content.includes(SYNC_LIST_START) || !content.includes(SYNC_LIST_END)) {
    // 마커가 없으면 (파일이 없거나 처음 만드는 경우) 기본 틀을 만든다
    const header =
      content.trim().length > 0
        ? content.trimEnd() + "\n\n"
        : "# 스터디 노트\n\n노션에서 자동으로 동기화된 노트 목록입니다.\n\n";
    content = `${header}${SYNC_LIST_START}\n${SYNC_LIST_END}\n`;
  }

  const startIdx = content.indexOf(SYNC_LIST_START) + SYNC_LIST_START.length;
  const before = content.slice(0, startIdx);
  const after = content.slice(startIdx);

  // 최신 항목이 위로 오도록 마커 바로 다음에 삽입
  const insertion = "\n" + newLines.join("\n");
  content = before + insertion + after;

  fs.writeFileSync(README_PATH, content, "utf8");
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const pages = await findDonePages();
  console.log(`동기화 대상 페이지: ${pages.length}개`);

  let successCount = 0;
  const readmeLines = [];

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
      console.log(`깃허브 동기화 체크 완료: ${title}`);

      // README에 넣을 링크 (경로의 각 구간을 URL 인코딩해서 공백/특수문자 대응)
      const relativeLink = filepath
        .split(path.sep)
        .map(encodeURIComponent)
        .join("/");
      readmeLines.push(`- ${date} - [${title}](${relativeLink})`);

      successCount += 1;
    } catch (err) {
      console.error(`실패 (${title} / ${date}):`, err.message);
      // 한 페이지 실패해도 나머지는 계속 진행
    }
  }

  updateReadme(readmeLines);
  if (readmeLines.length > 0) {
    console.log(`README.md에 ${readmeLines.length}개 링크 추가 완료`);
  }

  console.log(`총 ${successCount}개 파일 생성/업데이트 완료`);
}

main().catch((err) => {
  console.error("스크립트 실행 중 오류:", err);
  process.exit(1);
});
