import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HashRouter, BrowserRouter } from 'react-router-dom'
import store from './redux/store'
import { Provider } from 'react-redux'
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

