# React Nodebird

## ch1

- 초기 세팅
- eslint 설정

```command
npm init
npm i next
npm i react react-dom
npm i prop-types
npm i eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks -D
```

## ch2

- antd 적용

```command
npm i antd styled-components @ant-design/icons
```

## ch3

- redux 적용

```command
npm i next-redux-wrapper
npm i redux react-redux
npm i redux-devtools-extension
```

- 비동기는 요청, 성공, 실패 3단계로 나뉘어진다.
- 컴포넌트는 화면 그리는 것에 대해서만 집중하는 것이 좋다. 데이터까지 다루는 것은 컴포넌트의 역할이 아니다.
- 컴포넌트에서는 왠만하면 데이터 요청을 안하는 것이 좋다. (화면을 비즈니스 로직과 분리)
- 리덕스, 몹엑스에게 비동기 요청을 맡긴다.
