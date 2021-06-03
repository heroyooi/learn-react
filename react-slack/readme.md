# React Slack

## 백엔드 세팅

- MySQL 설치
- .env 파일 생성 및 작성

```env
COOKIE_SECRET=sleactcookie
MYSQL_PASSWORD=qwer1234
```

```command
npm i
npx sequelize db:create
npm run dev
```

- 위 순서대로 명령어를 실행해서 sleact 스키마를 생성하고, DB 연결 성공(테이블 생성됨)하면 다시 서버를 끄고 아래 명령어 실행

```command
npx sequelize db:seed:all
npm run dev
```

- 가짜 데이터 생성하고 다시 서버 실행

## 프론트 세팅

```command
npm init
npm i react react-dom
npm i typescript
npm i @types/react @types/react-dom
```

- eslint, prettier 적용

```command
npm i -D eslint prettier eslint-plugin-prettier eslint-config-prettier
```

- 타입스크립트가 바벨에게 넘겨주고, 바벨이 최종으로 자바스크립트로 변환해준다.
- 타입스크립트는 간단하게 정의하자면 자바스크립트에 변수, 함수의 매개변수, 함수의 반환값에 타입이 붙어있는 것이다.

```command
npm i -D webpack webpack-cli @babel/core babel-loader @babel/preset-env @babel/preset-react
npm i -D @types/webpack @types/node @babel/preset-typescript
npm i style-loader css-loader
npm i cross-env ts-node
```

- 핫로딩 적용

```command
npm i -D webpack-dev-server
npm i -D @types/webpack-dev-server
npm i -D @pmmmwh/react-refresh-webpack-plugin react-refresh
npm i -D fork-ts-checker-webpack-plugin
```

- fork-ts-checker-webpack-plugin: 타입스크립트 체크와 웹팩 실행을 동시에 해준다.(성능에 도움)

```command
npm i react-router react-router-dom
npm i -D @types/react-router @types/react-router-dom
```

- 코드 스플리팅 적용 단위: 페이지 단위, SSR 처리 안되는 컴포넌트

```command
npm i @loadable/component
npm i -D @types/loadable__component
```

```command
npm i @emotion/react @emotion/styled
```

```command
npm i axios
```

### 참고 링크

- [MySQL Installer 다운로드](https://dev.mysql.com/downloads/installer/)
- 위 링크로 들어가서 첫번째 용량 적은 파일(2.4M)이 아닌 2번째 용량 큰 파일(422.4M)로 설치
- [MySQL 커뮤니티 설치](https://thebook.io/080229/ch07/02/01-01)

### 강좌

2일차 01:02:00
