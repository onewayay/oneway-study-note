# CSR, SSR, SSG (+ISR)


> next.js는 CSR, SSR, SSG 3가지 데이터 페칭 전략을 제공하며 각 방식은 렌더링 시점과 데이터 최신성, SEO 최적화 측면에서 차이가 있습니다. CSR은 클라이언트에서 데이터를 로딩해 서버 부하를 줄일 수 있으나 SEO에 약점이 있고 초기에 로딩 지연 가능성이 있습니다. SSR는 요청마다 서버에서 HTML을 생성해 최신 데이터와 SEO에 강점이 있으나 서버 부하가 높아질 수 있습니다. SSG는 빌드 시점에 HTML을 미리 생성해 성능, SEO 최적화에 강점이 있으나 데이터 최신성에 한계가 있습니다. 그러나 이는 ISR로 보완 가능합니다.

- next.js는 리액트 기반의 웹 앱에서 데이터를 언제, 어디서 가져와 렌더링할지를 선택할 수 있는 여러가지 데이터 페칭 전략을 제공

## CSR

1. CSR이란?
	1. 서버에서 별도의 선처리를 하지 않고 자바스크립트를 이용해 클라이언트에서 직접 돔을 그리는 방식
		1. 리액트만 단독으로 사용할 때와 유사하게 동작하지만 코드 스플리팅, 이미지 최적화와 같은 next.js의 기능은 그대로 활용 가능
2. CSR 동작 원리
	1. 사용자가 웹 사이트에 요청
	2. 서버가 최소한의 HTML과 자바스크립트 파일을 전달
	3. 자바스크립트를 통해 돔을 생성하고 화면을 렌더링
3. next.js에서는 컴포넌트에 `use client` 지시어를 사용해 컴포넌트가 브라우저에서 실행되는 클라이언트 컴포넌트임을 명시
4. 데이터를 가져오는 예시

	```javascript
	'use client'
	
	import React, { useState, useEffect } from 'react';
	
	function Dashboard() {
		const [data, setData] = useState(null);
		const [loading, setLoading] = useState(true);
		const [error, setError] = useState(null);
		
		useEffect(()=>{
			const fetchData = async () => {
				try {
					setLoading(true);
					// API Routes를 통해 데이터를 가져옴
					const response = await fetch('/api/user-data');
					
					if(!response) throw new Error('데이터 페칭 실패');
					
					const result = await response.json();
					
					setData(result);
				} catch(err) {
					setError(err)
				} finally {
					setLoading(false);
				}
			};
			fetchData();
		}, []); // 빈 의존성 배열 -> 컴포넌트 마운트 시 한 번만 실행
		
		if(laoding) return <div>로딩중...</div>;
		if(error) return <div>에러: {error.message}</div>;
		
		return (
			<div>
				<h1>대시보드</h1>
				<p>사용자 이름: {data.name}</p>
				<p>이메일: {data.email}</p>
			</div>
		);
	};
	
	export default Dashboard;
	```

	1. 컴포넌트가 마운트 되면 useEffect가 실행되어 /api/user-data API에 요청을 보냄
	2. 응답 데이터를 상태에 저장한 뒤 화면을 다시 렌더링
	3. 즉, 초기에는 기본 UI가 먼저 렌더링되고 이후 브라우저에서 데이터를 가져와 화면을 업데이트하는 것
	4. 위 흐름이 CSR의 동작 방식
5. CSR의 장단점
	1. 장점
		1. 화면 전환이 부드러움
			1. 초기 로딩이 끝난 뒤에는 페이지를 이동할 때 전체 페이지를 다시 불러오지 않고 필요한 화면만 갱신하기 때문
		2. 서버는 부하가 적음
			1. 서버는 정적 파일만 제공하기 때문
	2. 단점
		1. 브라우저가 자바스크립트를 내려받고 실행하기 전까지 실제 화면이 그려지지 않으므로 빈 화면이 잠시 나타날 수 있음
		2. 검색 엔진 최적화에 불리
			1. 검색 엔진 크롤러가 자바스크립트를 실행하기 전에는 실제 콘텐츠를 인식하기 어렵기 때문
6. CSR은 언제 사용?
	1. 검색 엔진 최적화가 중요하지 않은 페이지
	2. 사용자 인증이 필요한 페이지
	3. 초기 로딩 속도보다 로딩 이후의 빠른 상호작용이 더 중요한 서비스
	4. 예시
		1. 사용자 로그인 후의 대시보드
		2. 관리자 페이지
		3. 실시간으로 데이터가 자주 변경되는 화면

## SSR

1. SSR이란?
	1. 요청마다 서버에서 데이터를 가져와 완성된 HTML을 미리 만들어서 브라우저에 전송하는 방식
2. SSR의 동작 원리
	1. 사용자가 웹 사이트에 접속
	2. next.js 서버가 해당 페이지 컴포넌트의 데이터 페칭 함수를 실행
	3. 페칭된 데이터를 기반으로 리액트 컴포넌트를 서버에 렌더링하여 완성된 HTML 문자열을 생성
	4. 서버는 이 완성된 HTML과 해당 페이지에 필요한 자바스크립트 코드를 브라우저에 전송
	5. 브라우저는 HTML을 즉시 렌더링하여 사용자에게 콘텐츠를 보여줌
	6. 자바스크립트가 다운로드 되고 실행되면, 서버에서 생성된 HTML에 이벤트 핸들러 등 상호작용 가능한 요소를 연결하는 하이드레이션 과정을 진행
3. 앱라우터 방식 SSR 예시

	```javascript
	// app/product/[id]/page.js
	import React from 'react';
	
	async function getProduct(id){
		const res = awit fetch(`http://api.examle.com/products/${id}`);
		// `res.json`은 자동으로 캐싱 및 revalidation 처리될 수 있음
		return res.json
	};
	
	// 이 컴포넌트는 기본적으로 Server Components로 동작(데이터 페칭은 서버에서)
	export default async function ProductDetailPage({ param }){
		const product = await getProduct(params.id); // await 키워드를 통해 데이터 페칭 대기
		
		return (
			<div>
				<h1>{product.name}</h1>
				<p>가격: {product.price}</p>
				<p>설명: {product.description}</p>
			</div>
		);
	};
	```

	1. 기본적으로 모든 컴포넌트가 Server Components로 동작
	2. 필요에 따라 Server Actions, Route Handlers를 활용해 서버에서 데이터를 페칭하고 렌더링할 수 있음
4. SSR의 장단점
	1. 장점
		1. 검색 엔진 최적화에 매우 유리
			1. 자바스크립트를 실행하지 않아도 검색 엔진 크롤러가 완성된 HTML 콘텐츠를 바로 읽을 수 있기 때문
		2. 초기 로딩 속도와 사용자 경험이 향상됨
			1. 첫 요청 때 서버에서 이미 렌더링된 HTML을 전달하기 때문에 빈 화면 없이 컨텐츠가 즉시 나타나기 때문
	2. 단점
		1. 서버 자원 소모가 많음
			1. 요청마다 서버에서 HTML을 렌더링해야 하기 때문
		2. 구현과 관리가 복잡해짐
			1. 코드가 서버와 클라이언트 양쪽에서 실행되는 구조이기에 개발자가 실행 환경을 모두 이해해야 하기 때문
5. SSR은 언제 사용?
	1. 데이터가 매우 자주 바뀌고, 사용자마다 다른 컨텐츠를 보여줘야 할 때
	2. 검색 엔진 최적화가 중요한 페이지
	3. 예시
		1. 뉴스 기사 페이지,
		2. 쇼핑몰 상품 상세 페이지
		3. 로그인 후 개인화된 화면

### SSG

1. SSG란?
	1. 빌드 시점에 모든 페이지를 미리 HTML 파일로 생성해 놓는 방식
2. SSG의 동작 원리
	1. next build 명령을 실행하면 next.js는 getStaticProps 및 getStaticPaths(페이지 라우터) 함수를 실행하여 필요한 데이터를 가져옴
	2. 페칭된 데이터를 기반으로 리액트 컴포넌트를 빌드 서버에서 렌더링하여 모든 페이지의 완성된 HTML 파일을 생성
	3. 생성된 HTML 파일들과 관련 자바스크립트, CSS 파일들이 CDN에 배포됨
	4. 사용자가 페이지를 요청하면 CDN에서 미리 생성된 HTML 파일을 즉시 전송
	5. 브라우저에서 자바스크립트가 로드되면 하이드데이션 과정을 거쳐 페이지를 상호작용 가능한 상태로 만듦
3. 앱라우터 SSG 예시  (ISR)

	```javascript
	import React from 'react';
	
	// 세그먼트 구성 옵션: 파일 최상단에서 동작을 명시
	export const dynamic = 'force-static';
	export const revalidate = 60;
	
	// 빌드 시점에 생성할 경로 정의
	export async function generateStaticParams(){
		const res = await fetch(`https://api.example.com/posts`);
		const posts = await res.json();
		return posts.map((post)=> ({ slug: post.slug }));
	};
	
	// 데이터 페칭(상단의 revalidate 설정이 이 fetch에도 적용)
	async function getPost(slug){
		const res = await fetch(`https://api.example.com/posts/${slug}`);
		if(!res.ok) return undefined;
		return res.json();
	};
	
	// 서버 컴포넌트
	export default async function BlogPost({ params }){
		const { slug } = await params;
		const post = await getPost(slug);
		
		if(!post) return <div>포스트를 찾을 수 없습니다.</div>
		
		return(
			<article>
				<h1>{post.title}</h1>
				<p>{post.content}</p>
			</article>
		);
	};
	```

	1. 앱 라우터는 기본적으로 서버 컴포넌트
	2. `export const dynamic = 'force-static';`
	`export const revalicate = N;` (ISR)
	위와 같은 설정들을 통해 SSG/ISR 동작을 명시
4. SSG의 장단점
	1. 장점
		1. 가장 빠르고 안정된 로딩 성능 제공
			1. 빌드시 모든 HTML이 생성되므로 서버에서 별도의 동적 처리를 할 필요가 없기 때문
		2. 검색 엔진 최적화에도 매우 유리, CDN 배포에 최적화되어 있음
			1. 완성된 HTML을 직접 전달하므로
		3. 서버 부하가 거의 없고 서버리스 환경에서 API 키 노출 등의 위험이 줄어듦
			1. 페이지 요청 시 서버에서 추가적인 렌더링 작업이 없기 때문
	2. 단점
		1. 페이지 수가 많거나 데이터 규모가 큰 경우 빌드 시간이 길어질 수 있음
		2. 빌드 이후 데이터가 변경되면 그 내용을 반영하기 위해 다시 빌드하고 배포해야 함
		(ISR 로 어느정도 해결 가능)
5. SSG는 언제 사용?
	1. 컨텐츠가 자주 변경되지 않고 검색 엔진 최적화가 중요한 정적인 페이지에 적합
	2. 예시
		1. 블로그 게시물
		2. 문서 사이트
		3. 마케팅 랜딩 페이지
