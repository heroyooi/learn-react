# Sleact

## back 준비

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

## ch1

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

- 핫 리로딩을 위해서 웹팩데브서버 설치

```command
npm i -D webpack-dev-server
npm i -D @types/webpack-dev-server
npm i @pmmmwh/react-refresh-webpack-plugin react-refresh
npm i -D fork-ts-checker-webpack-plugin
```

- package.json 파일에 dev 스크립트를 다음과 같이 작성한다.

```json
{
  "scripts": {
    "dev": "cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack serve --env development"
  }
}
```

```command
npm run dev
```

- 라우터 적용

```command
npm i react-router react-router-dom
npm i -D @types/react-router-dom
```

- 웹팩 설정파일에서 historyApiFallback를 true로 두면 새로고침시 라우터를 인식할 수 있다.

- client.tsx

```tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';

import App from '@layouts/App';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);
```

- App.tsx

```tsx
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LogIn from '@pages/LogIn';
import SignUp from '@pages/SignUp';

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
};
```

- 코드 스플리팅 적용
  - 페이지 단위로 적용하면 좋다.
  - SSR이 필요없는 경우 적용하면 좋다. 예)텍스트 에디터

```command
npm i @loadable/component
npm i -D @types/loadable__component
```

- App.tsx

```tsx
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
```

- import 하던 방식을 상수를 선언 방식으로 변경한다.

- CSS-in-JS 방식으로 컴포넌트 제작한다.

```command
npm i @emotion/react @emotion/styled
```

- 비동기 요청은 axios

```command
npm i axios
```

- CORS 에러 처리

  - 백엔드 개발자에게 보여준다.
  - 프론트 개발자가 스스로 해결한다.

  - webpack.config.ts

```ts
const config: webpack.Configuration = {
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://localhost:3095',
        changeOrigin: true,
      },
    },
  },
};
```

- 프론트, 백엔드 둘 다 localhost일 때 가능하다.
- 둘 다 localhost 일 경우 proxy로 cors 에러를 피해갈 수 있다.

- 로그인 한 데이터를 저장해야한다.
- SWR를 사용해서 전역적으로 상태를 관리할 수 있다.
  - 요청을 보내서 받아온 데이터를 저장한다.

```command
npm i swr
```

- swr 사용 예제

- @pages/LogIn/index.tsx

```tsx
import useSWR from 'swr';

const LogIn = () => {
  const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초, 캐쉬 유지 기간(2초 동안 요청을 여러번 보내도 서버에는 한번만 요청 보내고, 처음에 성공한 데이터를 그대로 가져오겠다.)
  });

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    axios.post('/api/users/login', { email, password }, { withCredentials: true })
      .then((response) => {
        revalidate(); // 서버에 요청을 보내서 내 정보를 가져온다
        mutate(response.data, false); // 기존에 갖고있던 내 정보를 데이터에 넣는다. (서버에 요청을 안보냄)
      })
      .catch(error) => {});
  }, []);

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }
};
```

- revalidate: 서버로 요청을 다시 보내서, 데이터를 다시 가져오는 것
- mutate: 서버로 요청을 보내지 않고, 데이터를 수정하는 것
  - 나중에 서버에 요청을 보내 점검을 하긴 한다.
  - mutate의 2번째 인자 값을 false로 설정하면 진짜로 서버에 요청을 안 보낸다.
    - 인스타의 좋아요가 좋은 예시, 좋아요를 누르자마자 서버를 거치지 않고 하트가 활성화가 된다.
    - 그게 바로 mutate의 효과이다.
    - OPTIMISTIC UI (긍정적, 낙관적 UI): 내가 보내는 요청이 성공할 것이라고 낙관하고 활성화시킨다. 그 다음 점검하겠다. 점검을 했는데 안됐으면 활성화를 비활성화 시킨다.
    - PESSIMISTIC UI (비관적 UI): 기본적으로 비관적 UI다.

```tsx
import useSWR, { mutate } from 'swr';

const Workspace: FC = () => {
  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate('/api/users', false, false);
      });
  }, []);
};
```

- 위와같이 범용적으로 사용할 수 있는 mutate도 있다.
- mutate 안에 키를 같이 넣어주고 false를 적어줘야한다.

- swr이 항상 비동기 요청이랑만 관련 있는 것은 아니다.

```tsx
const { data } = useSWR('hello', (key) => {
  localStorage.setItem('data', key);
  return localStorage.getItem('data');
});
```

- fethcer와 key를 선언하는대로 알아서 관리를 해준다.
- 로컬 스토리지 값을 가져올 수도 있다.
- 이렇게 swr이 전역 데이터 저장소 역할을 할 수 있다.

```tsx
const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
  dedupingInterval: 2000, // 2초
});
const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users#123', fetcher2, {
  dedupingInterval: 2000,
});
```

- 요청은 같게 보내면서 데이터는 다르게 저장

## ch3

```command
npm i gravatar @types/gravatar
```

- 버튼 클릭 시 에러 처리를 위해 토스트 팝업 설치

```command
npm i react-toastify
```

- 자주나는 에러 설명 (Invalid hook call.)

  - return문 아래에 hooks가 있을 경우
  - 반복문, if문 안에 hooks를 넣었을 때

- 주소 자체가 데이터를 저장하는 역할을 할 수 있다.

```tsx
import { useParams } from 'react-router';

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal }) => {
  const [newChannel, onChangeNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const onCreateChannel = useCallback(() => {
    axios.post(
      `/api/workspaces/${workspace}/channels`, // 어느 workspace에 채널을 만들 것인지 주소를 통해 알 수 있음
      {
        name: newChannel, // 새롭게 추가하는 채널 이름
      },
      {
        withCredentials: true, // 쿠키가 전달 -> 누가 생성하는지 알 수 있음
      },
    );
  }, [newChannel]);
};
```

## ch4

- Textarea 자동으로 높이 조절 및 키 이벤트

```command
npm i autosize
npm i -D @types/autosize
```

## ch5

- nest와 socket-io 3버전이 호환이 되지 않아서 2버전으로 설치
- backend 의 socket-io 버전도 2버전이어야한다.

```command
npm i socket.io-client@2
npm i -D @types/socket.io-client
```

- socket.io는 전역적인 특징을 띈다.
- 슬랙의 workspace는 namespace, 슬랙의 channel이 room
- 네임스페이스, 룸은 원래 웹소켓에는 없는 내용인데 socket.io에서 편하게 쓰라고 제공해주는 것

- useSocket.ts (socket.io 적용 예)

```ts
import io from 'socket.io-client';

const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`);
  }

  return [sockets[workspace], disconnect];
};
```

- layouts/Workspace/index.tsx (socket.io 적용 예)

```tsx
const Workspace: VFC = () => {
  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if (channelData && userData && socket) {
      console.log(socket);
      socket?.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) });
    }
  }, [socket, channelData, userData]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);
};
```

```command
npm i react-custom-scrollbars dayjs react-mentions
npm i -D @types/react-custom-scrollbars @types/react-mentions
```

- @emotion/styled 에서 변수 사용하는 예제

- ChatBox/index.tsx

```tsx
<EachMention focus={focus}>
  <img src={''} alt={''} />
  <span>{highlightedDisplay}</span>
</EachMention>
```

- styles.tsx

```tsx
export const EachMention = styled.button<{ focus: boolean }>`
  padding: 4px 20px;
  ${({ focus }) =>
    focus &&
    `
    background: #1264a3;
  `};
`;
```

```command
npm i regexify-string
```

- 정규 표현식 설명

  - // : 하나만 찾겠다.
  - //g : 모두 찾겠다.
  - \ (이스케이프) : 특수 기호를 무력화해주는 역할
  - . : 모든 글짜
  - .+ : 모든 글짜를 1개 이상
  - ? : 0개 이상
  - +? : 최대한 조금 (+만 있으면 최대한 많이)
  - \d : 숫자
  - \d+ : 숫자 1개 이상
  - | : 또는
  - \n : 줄바꿈

- regexify-string 사용 예제 (텍스트의 \n을 찾아서 br태그로 바꾸는 경우)

```tsx
const result = regexifyString({
  input: data.content,
  pattern: /\n/g,
  decorator(match, index) {
    return <br key={index} />;
  },
});

return result;
```

- 리버스 인피니티 스크롤링

## ch6

```tsx
function a(b: number | number[]) {
  if (typeof b === 'number') {
    b.toFixed();
  }
  if (Array.isArray(b)) {
    b.forEach(() => {});
  }
}
```

- 타입 가드 예제

- 빌드

```command
npm i webpack-bundle-analyzer
npm i @types/webpack-bundle-analyzer
```

- 웹팩 사용할 때 용량 문제를 체크하기 위해 설치해야한다.

- package.json

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack"
  }
}
```

```command
npm run build
```

- 빌드 후 app.js가 500KB 이하이면 좋다.
- 모듈명 tree-shaking 으로 검색해서 용량 줄일 수 있는 방법을 모색해본다.

- 이렇게 만들어진 dist폴더와 index.html 파일을 백엔드 개발자에게 전달해주면 된다.
- cicd로 자동화시켜준다.

```command
npm i @emotion/babel-plugin
npm i -D eslint-plugin-react eslint-plugin-react-hooks
npm i -D eslint-config-react-app eslint-plugin-flowtype eslint-plugin-import eslint-plugin-jsx-a11y
```
