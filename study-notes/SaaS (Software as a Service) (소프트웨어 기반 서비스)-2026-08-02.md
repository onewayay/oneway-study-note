# SaaS (Software as a Service) (소프트웨어 기반 서비스)

1. 개념
	1. 소프트웨어를 직접 설치하지 않고 인터넷으로 구독해서 사용하는 서비스 모델
	2. Gmail, Notion, Slack이 대표적인 예시이며, IaaS(인프라 제공), PaaS(플랫폼 제공)와 함께 클라우드 서비스의 세 가지 유형 중 하나
2. SaaS의 특징
	1. 구독 모델
		1. 대부분의 SaaS 서비스는 월별 또는 연간 구독 형태로 제공
		2. 예전: 포토샵 CD 30만원 → 내 컴퓨터에만 설치
		지금: Adobe Creative Cloud 월 3만원 → 어디서든 사용
	2. 클라우드 기반 접근
		1. SaaS 애플리케이션은 클라우드에서 호스팅되어 웹 브라우저를 통해 접근 가능
	3. 중앙 관리
		1. 모든 업데이트와 유지보수는 SaaS 제공업체가 담당
	4. 어디서든 접근 가능
		1. 회사 컴퓨터, 집 컴퓨터, 핸드폰 → 로그인만 하면 똑같은 환경
	5. 사용한 만큼 과금
		1. 팀원 5명 → 5명 요금
		팀원 50명 → 50명 요금
		필요에 따라 유연하게 조절
3. 장단점
	1. 장점
		1. 편리하고 쉬운 접근
			1. SaaS는 인터넷만 연결되어 있다면 언제 어디서나 접근이 가능한 편리한 사용 방식을 제공
			2. SaaS가 제공하는 실시간 협업 기능
				1. 여러 사용자가 동시에 동일한 문서나 프로젝트에 접근하여 작업할 수 있어 팀 생산성이 크게 향상
		2. 비용 효율성 극대화
			1. 기업의 IT 비용을 크게 절감할 수 있음
				1. 구독료만 지불하면 된다.
			2. 인프라 관리, 소프트웨어 업데이트, 보안 패치 등에 들어가는 유지보수 비용을 크게 절감할 수 있으며, 고성능 서버나 추가 스토리지 구매와 같은 하드웨어 관련 비용도 감소시킬 수 있음
		3. 간편한 설치 및 유지 보수
		4. 필요에 따라 확장이 용이
			1. 기업이 성장함에 따라 필요한 사용자 계정을 빠르게 추가할 수 있어 신규 직원 온보딩이나 조직 확장 시 IT 리소스 제약 없이 신속하게 대응 가능
			2. 전 세계 어디서나 일관된 서비스 품질을 제공
		5. 보안에 대한 우려를 줄여줌
			1. 제공 업체에서 데이터 보안과 백업 및 복원과 같은 보안 문제를 처리
			2. 일반적으로 백업 기능이 내장되어 있으므로, 데이터가 손실되거나 손상될 위험을 줄일 수 있음
	2. 단점
		1. 네트워크에 영향을 많이 받음
			1. 인터넷 없으면 못 씀
		2. 데이터 보안에 유의해야 함
			1. 내 데이터가 남의 서버에 있음
		3. 서비스 제공 업체에 대한 의존성
			1. 서비스가 종료되면 못 씀
		4. 장기적으로 구독료가 쌓이면 비쌀 수 있음
<details>
<summary>IaaS / PaaS / SaaS</summary>
1. IaaS (Infrastructure as a Service)
	1. 서버, 네트워크 등 인프라(하드웨어)만 제공하고 나머지는 직접 관리
	2. 제공해주는 영역
		1. 서버, 네트워크, 스토리지 (하드웨어)
	3. 내가 해야 하는 영역
		1. OS 설치, 런타임 설치, 앱 배포, 보안 설정
	4. 예시
		1. AWS EC2 → 서버 컴퓨터만 빌려줌
		2. AWS S3 → 저장공간만 빌려줌
		3. Google Cloud Compute Engine
		4. Microsoft Azure VM
	5. 대상
		1. 개발자/인프라팀
	6. 적합한 경우
		1. 세밀한 서버 제어가 필요할 때
		2. 특수한 환경 설정이 필요할 때
		3. 인프라팀이 있는 중대형 회사
	7. 비용
		1. 쓴 만큼 과금, 관리 인력 필요
2. PaaS (Platform as a Service)
	1. 인프라부터 미들웨어/플랫폼 영역까지 책임지고 서비스를 제공
	2. 제공해주는 영역
		1. 서버 + OS + 런타임 + 배포 환경
	3. 내가 해야 하는 것
		1. 코드만 올리면 됨
	4. 예시
		1. Heroku → 코드 올리면 알아서 배포
		2. Vercel → 프론트엔드 특화 PaaS
		3. Netlify → 프론트엔드 특화 PaaS
		4. Firebase → 구글의 앱 개발 플랫폼
	5. 대상
		1. 개발자
	6. 적합한 경우
		1. 인프라 관리보다 개발에 집중하고 싶을 때
		2. 소규모 팀, 스타트업
		3. 빠른 프로토타이핑
	7. 비용
		1. IaaS보다 비쌀 수 있지만 관리 인력 불필요
3. SaaS (Software as a Service)
	1. 인프라부터 미들웨어/플랫폼, 애플리케이션인 서비스 등 모든 영역을 책임지고 제공
	2. 제공해주는 영역
		1. 완성된 소프트웨어
	3. 내가 해야 하는 것
		1. 그냥 쓰기만 함
	4. 예시
		1. Gmail, Google Docs → 업무용
		2. Slack, Notion → 협업용
		3. Figma → 디자인용
		4. GitHub → 코드 관리
		5. Jira → 프로젝트 관리
	5. 대상
		1. 일반 사용자
	6. 적합한 경우
		1. 개발 없이 바로 쓸 수 있는 도구가 필요할 때
		2. 일반 사용자
	7. 비용
		1. 구독료만, 장기적으로는 비쌀 수 있음

---

- 실제로는 섞어서 사용한다
	- 예시
		- 개발/배포    → Vercel (PaaS)
		데이터베이스 → AWS RDS (IaaS)
		협업 도구    → Slack, Notion (SaaS)

```typescript
🏠 직접 만들기 (On-premise)
→ 밀가루, 토마토, 치즈 다 사서
→ 반죽부터 굽기까지 전부 직접

🛒 밀키트 (IaaS)
→ 재료는 제공해줌
→ 조리는 내가 함
→ 예) AWS EC2 (서버만 빌려줌, 나머지는 내가 설정)

🛵 배달 (PaaS)
→ 조리까지 해줌
→ 나는 먹기만 하면 됨
→ 예) AWS Elastic Beanstalk (코드만 올리면 배포까지 알아서)

🍕 식당 (SaaS)
→ 다 차려진 거 그냥 먹기만 함
→ 예) Gmail (그냥 쓰기만 하면 됨)
```


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3442b23b-9443-4152-a91e-e12128189cad/4e3ea7b0-2967-4516-ad57-ea7b19e50de9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664J3V3BFS%2F20260805%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260805T031814Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQCDIa31ZZ6OczMgjksHvhPH0ryKEUGCIGpyYrvz55PH4gIhAKUNBMs5jzy%2BtFX0hpNYP0x%2BjQt%2FgUc0uSCUm5aXqooTKv8DCBwQABoMNjM3NDIzMTgzODA1Igz3pgIDrmrKNK00qgAq3AOp36kgXc6XcN01Mmdz3o7PQgcC%2FvXci363Ke%2F4jhT%2FZ1iUYcUdxDMH9qdL%2Fwiy6GBzBd7Gtegn7yc1hFe05ch8ztP9FxzIiyobbLxyVk0noN3PrNUd1F%2B0ZgX5Sqz6YAyXoSIKOjfqIb10CPkEK6R5dBzwcMtHRqNfbbXLq2D50kxP0XyA3G23671%2BUz7TYorrVtmpp5Yk5KjcGaDrCYLivkRYMhPWH7oV6Sfsoqy7ugK9t6dXl4d4dzoMG6ckHLBu6bV6wVdnrvi9EWCUDkobcby3c%2Bwzrp33q8RCqS2p%2F7HrjFkAetbBE9kkYrRRQCcJhEwkCEx%2BnHW3RPPoJXDbn4m6ZIBVFjPijCqh9aZkfXy3BK26uElXpKHH3yb4HBRkNzYtmKo0gAQf3P%2BlPz8fJe8zlsVa77waRNMcZ0ESpTEzQfZvWWktPijf9Y1hkzX9H4lMurrFyI6PoMnTriPBY0sqX%2FAv182lCkp1X%2Bd%2BzTpj8iwNkLv7ZJCyqhebSEv%2BTQ8ChxTZDQzDsjVxVj2bHSSLS6IyUJQc1XG%2FgtiWznp7cZDd%2FsAWrTFHF%2F%2FzImeBZGm1cOtTc1s%2BjHCuZqkv%2FusUa%2FPDGUlA6KaZscF9jPos6ptp3f2PC6DVszD2w8rTBjqkAaLn%2FLCoYQ3M58R6V%2BmrgaehcuDMjVcapnWwo3lBEbGFG1YGjvw3YTRHXI8J9sR9reBcDjG4QiZ%2FmwwXFTI54p0v6RICFqoteA3FUimQ9DVNZeoOzDY2w0WueLBRY5b0A%2FXWxH3KDa%2Fbttkp0pozhnClUuvYdstkoqF6vy0u%2FO1KeZo8q0X9gq5uHVewZ18QqaDBrKOE9oy1S68YxfexWjX73KrB&X-Amz-Signature=a59c2db576529db7a11cb4d1e1c7befaa9ff320b89ef82731d148583f211cc43&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 클라우드 서비스 제공사가 많은 범위를 책임지고 알아서 서비스를 제공하게 되는 서비스(SaaS)일수록 비용은 올라가고, 사용자가 직접 책임지고 관여해야 하는 범위가 넓은 서비스(IaaS)일수록 사용자가 수동으로 검토해야 할 영역이 넓어지게 된다.
- 각 서비스별로 장단점이 존재하므로 클라우드를 도입해서 활용하는 환경을 기준으로 적절한 서비스 모델을 선택하면 됨.

</details>

