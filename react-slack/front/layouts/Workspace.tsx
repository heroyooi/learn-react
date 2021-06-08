import React, { FC, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const Workspace: FC = ({ children }) => {
  const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000, // 2초, 캐쉬 유지 기간(2초 동안 아무리 많이 호출해도 서버에는 딱 한번만 요청, 첫번째 요청 때 가져온 data로 사용)
  });

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
