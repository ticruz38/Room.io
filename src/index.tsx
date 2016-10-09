import * as React from "react";
import * as ReactDOM from "react-dom";

import { Router, Route, Link, browserHistory } from 'react-router'

import { Hello } from "./components/Hello";

import { RestaurantsFeed } from './restaurants/restaurantsFeed'; 

ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/" component={RestaurantsFeed}/>
    </Router>,
    document.getElementById("app")
);

import './index.scss';