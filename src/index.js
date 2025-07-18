import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterCustom from './router';
import { BrowserRouter } from 'react-router-dom';
import './style/style.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactSession } from "react-client-session";
import store from './redux/store';
import {Provider} from "react-redux"
import 'font-awesome/css/font-awesome.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

  const queryClient = new QueryClient();
  ReactSession.setStoreType('sessionStorage');

root.render(  
  <Provider store={store}>
<QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <RouterCustom/>
      </BrowserRouter>
  </QueryClientProvider>
  </Provider>
  
 );

