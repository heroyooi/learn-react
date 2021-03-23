# Learn React

## React Nodebird

### ch1

- 초기 세팅
- eslint 설정

```command
npm init
npm i next
npm i react react-dom
npm i prop-types
npm i eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks -D
```

### ch2

- antd 적용

```command
npm i antd styled-components @ant-design/icons
```

## Sleact

### back 준비

- back 폴더 내부에 .env 파일 작성
- back 폴더 설치 및 실행

```command
npm i
npx sequelize db:create
npm run dev
```

- Ctrl + C 로 빠져나와서 다음 명령어 실행

```command
npx sequelize db:seed:all
```

- workspaces, channels 테이블에 seeders 폴더에 정의한 가짜 데이터를 하나씩 만들어준다.

```command
npm run dev
```

- 다시 백엔드 서버 실행

### ch1

- 초기 세팅

```command
npm init
npm i react react-dom
npm i typescript
npm i @types/react @types/react-dom
npm i -D eslint prettier eslint-plugin-prettier eslint-config-prettier
```

- 타입스크립트가 한번 변환해주고 그걸 다시 웹팩이 받아서 바벨로 처리하여 자바스크립트 파일로 만든다.
  - 바벨을 쓰는 이유? 웹팩 로더 설정을 통해 css, image, html 같은 파일들을 js로 변환해주기 때문에 편리하다.
  - webpack.config.ts 파일로 바벨 설정을 해준다.

```command
npm i -D webpack webpack-cli
npm i -D @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/preset-typescript
npm i -D @types/webpack @types/node
npm i style-loader css-loader
npm i cross-env ts-node
```

- package.json 파일에 build 스크립트를 다음과 같이 작성한다.

```json
{
  "scripts": {
    "build": "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack"
  }
}
```

- tsconfig-for-webpack-config.json 파일도 생성해준다.

```command
npm run build
```

## 강좌

- 리액트 노드버드 3-1
- 슬랙클론코딩 1일차 | 01:19:20
