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

## SWR로 전역 데이터 관리

- swr: 요청을 보내서 받아온 데이터를 저장(보통 GET 요청)

```command
npm i swr
```

- 쿠키는 백엔드에서 생성해서 프론트엔드 브라우저가 기억하게끔 만들어준다.
- 프론트엔드에서는 한번 기억한 쿠키를 백엔드로 보내준다.
- 생성은 백엔드, 보내는 것은 프론트엔드

### SWR

- revalidate(): 서버로 요청을 보내서 데이터를 다시 가져오는 것
- mutate(data, shouldRevalidate)
  - shouldRevalidate가 false일 경우 서버에 요청 안보내고 로컬 데이터를 그대로 수정하는 것(서버 검사 안함)
  - shouldRevalidate가 true이면 서버에 요청을 보내 점검 한다. 바로 반영되어서 사용성이 좋아진다.(OPTIMISTIC UI)
  - mutate는 성공했다는 전제하에 사용해야한다.

```js
import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url) => axios.get(url).then((response) => response.data);

const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
  dedupingInterval: 2000, // 2초
});
```

- dedupingInterval: 캐쉬 유지 기간(2초 동안 아무리 많이 호출해도 서버에는 딱 한번만 요청, 첫번째 요청 때 가져온 data로 사용)

- swr은 꼭 비동기 요청과만 관련된 건 아니다. swr은 전역 데이터 관리자로 사용할 수 있다.

```js
const { data } = useSWR('hello', (key) => {
  localStorage.setItem('data', key);
  return localStorage.getItem('data');
});
```

- swr은 조건부 요청도 지원한다.

### SWR Devtools

```command
npm i @jjordy/swr-devtools
```

## 3일차

```command
npm i gravatar @types/gravatar
npm i react-toastify
```

- useCallback은 async, await를 사용할 수 있지만, useEffect안에서 사용하면 타입스크립트에서 에러가 난다.
- useEffect안에서도 return을 사용하지 않으면 async, await를 사용할 수 있다.(근데 원칙적으로는 안되는 것이 맞다.)

```js
const a = useCallback(async () => {}, []);

useEffect(() => {
  a().then(); // 가능하다 O
}, []);

useEffect(async () => {}, []); // 기본적으로 문제가 있다. X
```

## 4일차

- 함수(동사), 변수(명사) 이름을 자세하게 적으면 함수, 변수 이름 자체가 주석이 된다.
- 하나의 컴포넌트가 하나의 역할만 하면 좋다.

```command
npm i autosize
npm i react-mentions @types/react-mentions
npm i -D @types/autosize
```

## 5일차

```command
npm i socket.io-client@2
npm i -D @types/socket.io-client@1.4.35
```

- socket.io 2버전 nest 7버전과 호환

```command
npm i react-custom-scrollbars
npm i -D @types/react-custom-scrollbars

npm i dayjs
npm i react-mentions
npm i -D @types/react-mentions

npm i regexify-string
```

### 참고 링크

- [MySQL Installer 다운로드](https://dev.mysql.com/downloads/installer/)
- 위 링크로 들어가서 첫번째 용량 적은 파일(2.4M)이 아닌 2번째 용량 큰 파일(422.4M)로 설치
- [MySQL 커뮤니티 설치](https://thebook.io/080229/ch07/02/01-01)
- [SWR 옵션 | 깃헙](https://github.com/vercel/swr#options)
- [강의 자료 | 깃헙](https://github.com/ZeroCho/sleact/tree/master/alecture)

### 강좌

5일차 01:51:30
