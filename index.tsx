import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import routes from 'routes';


export default function loadApp() {
  ReactDOM.render(
    <Router
      history={ hashHistory }
      routes={ routes }
    />,
    document.getElementById('app')
  );
}

loadApp();