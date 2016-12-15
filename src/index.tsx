import * as React from 'react';
import * as ReactDOM from "react-dom";

import * as ReactRouter from 'react-router';

import { RestaurantsFeed } from './restaurants/RestaurantsFeed';
import { Welcome } from './welcome/Welcome';
import { Layout } from '../crankshaft/Layout';
import { StartBusiness } from './start/StartBusiness';
import { Room } from './start/Room';

const { Router, Route, Link, hashHistory } = ReactRouter;


ReactDOM.render(
    <Router history={hashHistory}>
      <Route component={Layout}>
        <Route path="/start" component={StartBusiness}/>
        <Route path="/room" component={Room}/>
        <Route path="/" component={Welcome}/>
      </Route>
    </Router>,
    document.getElementById("app")
);

import './index.scss';