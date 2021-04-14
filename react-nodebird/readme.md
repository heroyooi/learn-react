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

```command
npx sequelize init
```

- 시퀄라이즈 초기화를 시킨다.

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

### 1대다 관계

- 1: hasMany, 다: belongsTo(본문과 댓글)
- models/post.js, comment.js

```js
Post.associate = (db) => {
  db.Post.hasMany(db.Comment);
};

Comment.associate = (db) => {
  db.Comment.belongsTo(db.Post);
};
```

- 한 본문이 여러 댓글을 가질 수 있다.
- belongsTo는 PostId라는 컬럼을 만들어준다.

### 다대다 관계

- 둘 다 belongsToMany(본문과 해시태그)
- models/post.js, hashtag.js

```js
Post.associate = (db) => {
  db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
};

Hashtag.associate = (db) => {
  db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
};
```

- 여러 게시글이 여러 해시태그를 가질 수 있다.
- belongsToMany는 좀 특별하다. 중간 테이블이 하나 생긴다. PostHashtag 시퀄라이즈가 알아서 만들어준다.
- HashtagId, PostId가 짝지어진다. 그래서 해시태그로 본문 검색이 가능해진다.

- 유저와 좋아요

```js
Post.associate = (db) => {
  db.Post.belongsToMany(db.User, { through: 'Like' });
};

User.associate = (db) => {
  db.User.belongsToMany(db.Post, { through: 'Like' });
};
```

- 중간 테이블명이 through로 설정한 Like가 된다.
- 만약 따로 설정을 하지 않으면 PostUser가 된다. 의미를 알 수 없게됨

### 1대1 관계

- hasOne, belongsTo (유저와 유저 정보)
- belongsTo가 있는 곳에 UserId 컬럼이 생긴다.

### 기타

- 관계가 헷갈리는 경우 as를 사용해 별칭을 지어줄 수 있다.

```js
Post.associate = (db) => {
  db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser (belongsTo 단수)
  db.Post.hasMany(db.Image); // post.addImages (hasMany 복수)
  db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers, post.removeLikers (belongsToMany 복수)
  db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
};
```

- 나중에 as에 따라서 post.getLikers처럼 게시글 좋아요 누른 사람을 가져올 수 있다.

- 같은 모델간에도 관계가 있을 수 있다. (팔로잉, 팔로워)

```js
User.associate = (db) => {
  db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
  db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
};
```

- 같은 모델에서 다대다 정의를 할 경우 foreignKey가 생긴다. foreignKey는 반대로 적어줘야한다.
- foreignKey는 컬럼명을 바꿔주는 것이다. 위 설정하지 않으면 UserId 이런식으로 생성된다.

- 같은 모델이서 1대다 정의를 할 수 있다. (리트윗)

```js
Post.associate = (db) => {
  db.Post.belongsTo(db.Post, { as: 'Retweet' });
};
```

- Post 모델 컬럼에 RetweetId가 생성된다.

```command
npx sequelize db:create
```

- config 내용대로 db 생성

- 소스를 바꿀 때마다 반영되도록 자동화가 필요하다.
- package.json 에 scripts 로 nodemon app 설정

```command
npm i -D nodemon
npm run dev
```

- 비밀번호 암호화

```command
npm i bcrypt
```

- routes/user.js

```js
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  try {
    const exUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (exUser) {
      return res.status(403).send('이미 사용 중인 아이디입니다.'); // 응답 실패(클라이언트)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(200).send('ok'); // 응답 성공
  } catch (error) {
    console.error(error);
    next(error); // 에러들이 한방에 처리된다. 에러가 발생하면 express가 알아서 브라우저에게 알려준다.
  }
});
```

- 요청/응답은 헤더(상태, 용량, 시간, 쿠키)와 바디(데이터)로 구성되어있다.
- 상태 코드

  - 200 성공 (201 잘 생성됨)
  - 300 리다이렉트
  - 400 클라이언트 에러 (401 비인증, 403 허용되지 않음, 404 주소에 해당하는 컨텐츠가 없음)
  - 500 서버 에러

- CORS 에러
- 브라우저에서 다른 도메인 서버로 요청을 보낼 때 생긴다.
- 서버에서 서버로 요청을 보내면 안 생김
- proxy 방식을 통해 cors 에러를 해결하는 방법이 있다.
  - 프록시 방식을 통해 브라우저에서 프론트 서버로, 프론트 서버에서 백엔드 서버로 보내면 에러를 해결할 수 있음

```command
npm i cors
```

- app.js

```js
app.use(
  cors({
    origin: true, // 'https://nodebird.com'
  }),
);
```

- 로그인 구현하기

```command
npm i passport passport-local

```

### cookie, session

```command
npm i express-session cookie-parser
```

- app.js

```js
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

app.use(cookieParser('nodebirdsecret'));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: 'nodebirdsecret',
  }),
);
app.use(passport.initialize());
app.use(passport.session());
```

- 브라우저는 누구나 접속할 수 있기 때문에 해킹에 취약함. 위험한 곳에는 랜덤한 문자열을 보냄.
- 로그인하면 브라우저(3060)와 서버(3065)가 같은 정보를 가지고 있어야한다.
- 백엔드 서버에서 브라우저로 인증 관련된 쿠키(랜덤한 토큰)를 보내준다.
- 백엔드 서버 쪽에선 통째로 세션으로 저장한다.
  - 서버 쪽에선 메모리를 아끼기 위해서 쿠키에 사용자의 전체 정보가 아닌 id만 매칭을 시킨다.
- 브라우저는 게시글을 쓰든, 댓글을 쓰든 쿠키를 백엔드 서버로 보내주고, 백엔드 서버에서는 그 정보를 가지고 누구인지 알아낼 수 있다.

### dotenv

```command
npm i dotenv
```

- config/config.js

```.env
COOKIE_SECRET=nodebirdsecret
DB_PASSWORD=qwer1234
```

```js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'react-nodebird',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
```

- .env 파일은 핵심 관리자들끼리만 가지고 있어야한다. git으로 소스를 올리면 안됨

### 에러 처리 미들웨어

- app.js (직접 에러 처리 미들웨어를 작성하고 싶을 때)

```js
app.use((err, req, res, next) => {});
app.listen(3065, () => {
  console.log('서버 실행 중!');
});
```

- 브라우저랑 백엔드 서버랑 도메인이 다르면 cors 문제가 생긴다.
- 도메인이 다르면 쿠키도 전달이 안된다. 백엔드 서버는 그 요청을 누가 보냈는지 알 수가 없다.
- 로그인을 했는데, 로그인 하라고 에러 메세지가 뜨면 쿠키 전달이 안되고 있는 것을 의심해 봐야한다.

- back/app.js

```js
app.use(
  cors({
    origin: true, // 'https://nodebird.com'
    credentials: true,
  }),
);
```

- front/sagas/post.js

```js
function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data, {
    withCredentials: true,
  });
}
```

- 이렇게 백엔드와 프론트엔드에서 credentials: true 설정을 해줘야 쿠키가 잘 전달된다.
- 그런데 매번 요청할 때마다 같은 설정을 넣어주면 중복이 발생하므로 다음과 같이 한다.

- front/sagas/index.js

```js
axios.defaults.withCredentials = true;
```

- 서버에 기록하기 위한 모듈 설치

```command
npm i morgan
```

### multipart

- multipart를 백엔드에서 처리할 수 있도록 multer를 설치

```command
npm i multer
```

- 나중에는 하드디스크가 아니라 AWS의 S3같은 클라우드 서비스에 업로드를 할 것이다.
- 실습은 잠깐 하드디스크에다가 하지만 나중엔 AWS의 S3 서비스로 대체할 것이다.
- 이미지나 동영상은 서버에 매우 부담을 주기 때문에, 왠만하면 프론트에서 클라우드로 바로 올리는 것으로 하는 것이 좋다.

- front/components/PostForm.js

```js
const PostForm = () => {
  return <input type="file" name="image" multiple hidden ref={imageInput} />;
};
```

- back/app.js

```js
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      // 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 제로초
      done(null, basename + new Date().getTime() + ext); // 제로초15184712891.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {});
```

- upload.array: 이미지를 여러장
- upload.single: 이미지를 한장
- upload.none(): text(json)만 있다.
- upload.fills: file 인풋이 2개 이상 있을 때

- 해쉬태그를 추출하기 위한 정규표현식

## ch6

```command
npm rm next-redux-saga
```

- next-redux-saga 가 필요 없어 졌으므로 삭제

### getServerSideProps

- 접속할 때마다 접속한 상황에 따라서, 화면이 바뀌어야 하면 사용해야 한다.

- front/pages/index.js

```js
import { END } from 'redux-saga';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
```

- CSR 방식이 아닌 SSR 처리

## SSR시 쿠키 공유

- 기존에 credentials, cors 문제 때문에 쿠키 전달이 안됐었음
- getServerSideProps는 프론트 서버에서 실행됨
- 원래 CSR방식 에서는 브라우저가 직접 쿠키를 담아서 백엔드로 보내줌
- SSR의 주체는 프론트 서버에서 백엔드 서버로 보낸다.(브라우저는 아예 개입 조자 못함)

- front/pages/index.js

```js
import axios from 'axios';

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = cookie;
}
```

- SSR시 쿠키를 인식할 수 있도록 해준다. 그런데 이렇게 하면 문제가 있다. 서버는 AWS에 하나밖에 없고, 하나밖에 없는 서버에서 axios.defaults 값으로 내 쿠키 정보를 넣어주면 다른 사람이 접근해도 내 정보를 참조하게 된다.

```js
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
}
```

- 이렇게 해주면 내 쿠키 정보가 공유되는 현상을 방지할 수 있다.

### getStaticProps

- 언제 접속해도 데이터가 바뀔 일이 없을 때, SSR 처리를 위해 쓴다.(쓰기가 좀 까다롭다.)
- 예) 블로그 게시글, 뉴스(빈번하게 수정되지 않는)
- Next에서 빌드해줄 때 정적인 HTML 파일로 뽑아준다.

### Next 바벨 설정

- 설치 및 작성

```command
npm i babel-plugin-styled-components
```

```.babelrc
{
  "presets": ["next/babel"],
  "plugins": [
    [
      "babel-plugin-styled-components",
      {
        "ssr": true,
        "displayName": true
      }
    ]
  ]
}

```

- axios 요청 시 한글 처리

```js
function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}
```

## 강좌

- 리액트 노드버드 6-6

## 도전 과제

- passport (kakao, facebook 회원가입, 로그인 만들기)
