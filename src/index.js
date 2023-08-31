import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import marvelService from './services/marvelService';
import './style/style.scss';

const MarvelService = new marvelService();

MarvelService.getAllCharacters().then(res => console.log(res));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

