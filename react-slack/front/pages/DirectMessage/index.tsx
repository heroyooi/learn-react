import React from 'react';
import gravatar from 'gravatar';
import { Container, Header } from './styles';

const DirectMessage = () => {
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
    </Container>
  );
};

export default DirectMessage;
