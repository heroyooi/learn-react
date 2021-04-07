# React Nodebird

## ch1

- 프론트 서버 초기 세팅
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
npm i react-slick
npm i styled-components
```

- 비동기는 요청, 성공, 실패 3단계로 나뉘어진다.
- 컴포넌트는 화면 그리는 것에 대해서만 집중하는 것이 좋다. 데이터까지 다루는 것은 컴포넌트의 역할이 아니다.
- 컴포넌트에서는 왠만하면 데이터 요청을 안하는 것이 좋다. (화면을 비즈니스 로직과 분리)
- 리덕스, 몹엑스에게 비동기 요청을 맡긴다.

## ch4

- redux 미들웨어 설치
  - redux 미들웨어: 리덕스의 기능을 향상 시켜주는 역할

```command
npm i redux-thunk
```

- 사용 예제

```js
export const loginAction = (data) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(loginRequestAction());
    axios
      .post('/api/login')
      .then((res) => {
        dispatch(loginSuccessAction(res.data));
      })
      .catch((err) => {
        dispatch(loginFailureAction(err));
      });
  };
};

export const loginRequestAction = (data) => {
  return {
    type: 'LOG_IN_REQUEST',
    data,
  };
};

export const loginSuccessAction = (data) => {
  return {
    type: 'LOG_IN_SUCCESS',
    data,
  };
};

export const loginFailureAction = (data) => {
  return {
    type: 'LOG_IN_FAILURE',
    data,
  };
};
```

- redux-saga 설치

```command
npm rm redux-thunk
npm i redux-saga next-redux-saga
npm i axios
```

### 제너레이터

```js
const gen = function* () {
  console.log(1);
  yield;
  console.log(2);
  yield;
  console.log(3);
  yield 4;
};
const g = gen();
g.next();
```

```js
g.next(); // 1, {value: undefined, done: false}
g.next(); // 2, {value: undefined, done: false}
g.next(); // 3, {value: 4, done: false}
g.next(); // {value: undefined, done: true}
```

- 함수를 중간에 중단할 수 있다.
- 위와 같이 이벤트 리스너와 같은 역할도 할 수 있다.

- 리덕스 사가 패턴

```js
function logInAPI(data, a, b, c) {
  return axios.post('/api/login', data);
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data, 'a', 'b', 'c'); // 1
    // 2
    yield put({
      type: 'LOG_IN_SUCCESS',
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_IN_FAILURE',
      data: err.response.data,
    });
  }
}

function* watchLogIn() {
  yield takeEvery('LOG_IN_REQUEST', logIn);
}

export default function* rootSaga() {
  yield all([fork(watchLogIn), fork(watchLogOut)]);
}
```

- 리덕스 사가는 테스트할 때 편하다.
- 동작이 잘 되고 있는지 보장이 되어야 한다.
- 아래와 같이 테스트 코드를 짤 때 제너레이터가 좋다.

```js
const l = logIn({ type: 'LOG_IN_REQUEST', data: { id: 'heroyooi@naver.com' } });
l.next(); // 위 logIn 함수의 1 실행됨
l.next(); // 위 logIn 함수의 2 실행됨
```

- 사가의 이펙트

  - takeEvery: 모든 요청
  - takeLatest: 여러번 요청 보낼 때, 앞의 요청을 무시하고 마지막 요청만 알아서 실행해준다.
  - takeLeading: 여러번 요청 보낼 때, 처음 요청만 실행(나머지는 요청은 무시)
  - throttle: 시간 제한을 둬서, 그 시간 동안에는 한번만 요청을 실행하도록 한다. (스크롤)
  - debounce: 단어가 완성될 때 요청을 보내고 싶을 때 (검색창 타이핑)

  - 프론트 서버에서만 위와 같이 실행된다.
  - 동시에 두 번 요청을 보냈다고 생각했을 때, takeLatest를 사용하면 요청은 두번가고, 응답은 한번만 온다. 요청까지는 취소를 할 수가 없다.
  - 요청이 한번에 너무 많이 되면 throttle을 써서 요청이 안가도록 막는 것이 좋다.

- eslint 점검

```command
npm i -D babel-eslint eslint-config-airbnb eslint-plugin-import
npm i -D eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

- 더미데이터

```command
npm i shortid faker
npm i immer
```

## ch5

- 백엔드 서버 초기 세팅

```command
npm init
npm i express
```

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('hello express');
});
```

- app의 메서드

  - app.get : 가져오다
  - app.post : 생성하다
  - app.put : 전체 수정
  - app.delete : 제거
  - app.patch : 부분 수정
  - app.options : 찔러보기 (서버야 요청 보내도 되니?)
  - app.head : 헤더만 가져오기(원래는 헤더/바디 둘 다 온다)

  - REST API를 지키기 어렵다. => 게시글 가져오면서 조회수 1을 올릴 경우 get을 써야할 지, patch를 해야할 지 난해하다.
  - 애매하면 post를 쓰면 된다.

```command
npm i sequelize sequelize-cli mysql2
```

- mysql2: node와 mysql을 연결해주는 드라이버(이 모듈 자체가 mysql은 아니다)

- 시퀄라이즈 초기화를 시킨다.

```command
npx sequelize init
```

- 파일이 생성되면 config/config.json 파일의 정보를 맞게 수정해준다.
- models/index.js 파일 내용을 수정해준다.
- models 폴더에 모델들을 정의해준다. (comment, hashtag, image, post, user)

- models/user.js

```js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User', // MySQL에는 users 테이블 생성 (시퀄라이즈와 MySQL간의 규칙)
    {
      // id가 기본적으로 들어있다.
      email: {
        type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER(정수), FLOAT(실수), DATETIME
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
    },
  );
  User.associate = (db) => {};
  return User;
};
```

- 시퀄라이즈에서는 mysql의 테이블을 모델이라고 부른다.
- 모델들 간의 관계를 정의 해줘야한다.

## 강좌

- 리액트 노드버드 5-6
