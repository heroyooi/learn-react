import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import { Card, Avatar } from 'antd';
import AppLayout from '../components/AppLayout';
import { LOAD_USER_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      <Head>
        <title>Heroyooi | NodeBird</title>
      </Head>
      <AppLayout>
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts.length}
            </div>,
            <div key="followings">
              팔로잉
              <br />
              {userInfo.Followings.length}
            </div>,
            <div key="followers">
              팔로워
              <br />
              {userInfo.Followers.length}
            </div>,
          ]}
        >
          <Card.Meta avatar={<Avatar>{userInfo.nickname[0]}</Avatar>} title={userInfo.nickname} />
        </Card>
      </AppLayout>
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps(async (context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 2,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default About;
