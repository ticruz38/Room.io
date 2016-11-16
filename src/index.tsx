import * as React from 'react';
import * as ReactDOM from "react-dom";

import * as ReactRouter from 'react-router';

import { RestaurantsFeed } from './restaurants/RestaurantsFeed';
import { Welcome } from './welcome/Welcome';
import { Layout } from '../crankshaft/Layout';
import { StartBusiness } from './form/StartBusiness';

const { Router, Route, Link, browserHistory } = ReactRouter;

ReactDOM.render(
    <Router history={browserHistory}>
      <Route component={Layout}>
        <Route path="/start-business" component={StartBusiness}/>
        <Route path="/" component={Welcome}/>
      </Route>
    </Router>,
    document.getElementById("app")
);

import './index.scss';