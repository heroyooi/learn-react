import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { loadPostsAPI } from '../sagas/post';
import { loadMyInfoAPI } from '../sagas/user';
import { backUrl } from '../config/config';
import { initialState as userInitialState } from '../reducers/user';
import { initialState as postInitialState } from '../reducers/post';

const Home = (props) => {
  console.log('props', props);
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      // eslint-disable-next-line max-len
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  axios.defaults.baseURL = backUrl;

  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  const results = await Promise.allSettled([loadPostsAPI(), loadMyInfoAPI()]);
  const [posts, myInfo] = results.map((result) => result.value.data);
  return {
    props: {
      initialState: {
        user: {
          ...userInitialState,
          me: myInfo,
        },
        post: {
          ...postInitialState,
          mainPosts: posts,
        },
      },
    },
  };
};

export default Home;
