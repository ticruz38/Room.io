import * as React from 'react';
import * as ReactDOM from "react-dom";

import * as ReactRouter from 'react-router';

import { RestaurantsFeed } from './restaurants/restaurantsFeed';

const { Router, Route, Link, browserHistory } = ReactRouter;

ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/" component={RestaurantsFeed}/>
    </Router>,
    document.getElementById("app")
);

import './index.scss';