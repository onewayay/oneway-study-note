# REST / REST API / RESTful API


> 🍦 각각 다르지만 연결된 개념  
> REST         →  규칙/원칙 (개념) / "이렇게 만들어라"는 설계 원칙  
> REST API     →  REST를 따라 만든 API / 그 원칙을 참고해서 만든 API   
> RESTful API  →  REST를 제대로 잘 따른 API / 그 원칙을 제대로 잘 지킨 API


	REST         →  규칙/원칙 (개념) / "이렇게 만들어라"는 설계 원칙
	REST API     →  REST를 따라 만든 API / 그 원칙을 참고해서 만든 API 
	RESTful API  →  REST를 제대로 잘 따른 API / 그 원칙을 제대로 잘 지킨 API


### REST

1. 개념
	1. 2000년에 로이 필딩(Roy Fielding)이 논문에서 제안한 아키텍처 스타일
	2. HTTP를 기반으로 클라이언트가 서버의 리소스에 접근하는 방식을 규정한 아키텍쳐
2. 6가지 원칙
	1. 클라이언트 - 서버 구조
		1. 클라이언트(브라우저) → 화면 담당
		2. 서버 → 데이터 담당
		3. 서로 독립적으로 존재한다
		(프론트엔드, 백엔드가 분리된 이유)
	2. 무상태 (Stateless)
		1. 서버는 클라이언트의 상태를 저장하지 않음
		2. 예시
			1. 요청할 때마다 클라이언트에서 클라이언트에서 유저 정보와 토큰을 함께 넘김
			2. 서버는 매 요청마다 새로 확인작업을 거침
	3. 캐시 처리
		1. 서버 응답에 "이 데이터는 캐시해도 돼 / 안 돼"를 명시
		→ 클라이언트가 캐시해서 재사용 가능
		→ 성능 향상
	4. 균일한 인터페이스
		1. URL 형식, HTTP 메서드 등을 일관된 규칙으로 사용 (가장 핵심 원칙)
		→ 누가 봐도 이해할 수 있는 API
	5. 계층형 구조
		1. 클라이언트 → 중간 서버(보안, 로드밸런서) → 실제 서버
		2. 클라이언트는 중간에 뭐가 있는지 몰라도 됨
	6. Code on Demand (선택사항)
		1. 서버가 클라이언트에 코드를 보내서 실행시킬 수 있음
		(선택사항이라 잘 언급 안 됨)
		2. 예시
			1. JavaScript 파일을 서버에서 내려받아 실행

### REST API

1. 개념
	1. REST 원칙을 기반으로 만든 API
2. API란?
	1. API (Application Programming Interface)
	→ 프로그램끼리 대화하는 창구
3. 핵심 구성요소
	1. 자원(resource), 행위(verb), 표현(representations)

		| 구성요소 | 내용                | 표현방법        |
		| ---- | ----------------- | ----------- |
		| 자원   | 자원                | URI(엔드포인트)  |
		| 행위   | 자원에 대한 행위         | HTTP 요청 메서드 |
		| 표현   | 자원에 대한 행위의 구체적 내용 | 페이로드        |

4. 주요 기본 설계 원칙
	1. URI는 리소스를 표현해야 한다. (명사 사용)
		1. 리소스를 식별할 수 있는 이름은 동사보다는 명사를 사용할 것
			1. 이름에 get 같은 해우이에 대한 표현이 들어가서는 안된다.
		2. 좋은 예
			1. GET /users → 유저 목록
			2. GET /users/1 → 1번 유저
			3. GET /users/1/posts → 1번 유저의 게시글
		3. 나쁜 예
			1. GET /getUsers
			2. GET /getUserById
			3. POST /createUser
	2. 리소스에 대한 행위는 HTTP 요청 메서드로 표현한다.
		1. 5가지의 요청 메서드를 올바르게 사용하여 CRUD 구현
		(GET, POST, PUT, PATCH, DELETE)

			| HTTP 요청 메서드 | 종류             | 목적           | 페이로드 |
			| ----------- | -------------- | ------------ | ---- |
			| GET         | index/retrieve | 모든/특정 리소스 취득 | X    |
			| POST        | create         | 리소스 생성       | O    |
			| PUT         | replace        | 리소스의 전체 교체   | O    |
			| PATCH       | modify         | 리소스의 일부 수정   | O    |
			| DELETE      | delete         | 모든.특정 리소스 삭제 | X    |

		2. 리소스에 대한 행위는 URI에 표현하지 않는다.
		3. 좋은 예
			1. DELETE /todoe/1
		4. 나쁜 예
			1. GET /todos/delete/1

### RESTful API

1. 개념
	1. "REST 원칙을 제대로, 충실하게 지킨 API
2. RESTful 예시
	1. 잘 지킴
		1. GET    /users      → URL은 명사, 행위는 메서드로
		2. DELETE /users/1    → DELETE 메서드로 삭제
		3. 응답에 적절한 상태코드 사용
	2. 못 지킴
		1. POST /getUserList        → URL에 동사 사용
		2. GET  /user/delete/1      → GET으로 삭제
		3. POST /user/1/doSomething → 행위가 URL에 들어감
		4. 응답 상태코드 항상 200   → 에러도 200으로 반환
