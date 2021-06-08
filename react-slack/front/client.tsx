import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import SWRDevtools from '@jjordy/swr-devtools';
import { cache, mutate } from 'swr';

import App from '@layouts/App';

render(
  <BrowserRouter>
    <>
      {process.env.NODE_ENV === 'production' ? null : <SWRDevtools cache={cache} mutate={mutate} />}
      <App />
    </>
  </BrowserRouter>,
  document.querySelector('#app'),
);
