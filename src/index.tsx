import * as React from 'react';
import * as ReactDOM from "react-dom";

import * as ReactRouter from 'react-router';

import { RestaurantsFeed } from './restaurants/RestaurantsFeed';
import { Welcome } from './welcome/Welcome';
import { Layout } from '../crankshaft/Layout';

const { Router, Route, Link, browserHistory } = ReactRouter;

ReactDOM.render(
    <Router history={browserHistory}>
      <Route component={Layout}>
        <Route path="/" component={Welcome}/>
      </Route>
    </Router>,
    document.getElementById("app")
);

import './index.scss';