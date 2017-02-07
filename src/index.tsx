import * as React from 'react';
import * as ReactDOM from "react-dom";
import { graphql } from 'graphql';
import { observer } from 'mobx-react';

import { Router, Redirect, Route, Link, hashHistory } from 'react-router';

import RoomFeed from './rooms/RoomFeed';
import Welcome from './welcome/Welcome';
import Layout, { layoutState } from './layout/Layout';
import Room from './start/Room';
import Profile from './profile/Profile';
import Stuffs from './start/Stuffs';
import Schema from './graphql-client/Root';


const Graphiql = require('graphiql');

const Graph = _ =>
  <Graphiql
    fetcher={graphqlParams => {
      //console.log(graphqlParams);
      return graphql(
        Schema,
        graphqlParams.query,
        {},
        graphqlParams.variables,
        graphqlParams.operationName
      )
    }
    }
    schema={Schema}
    />
console.log(layoutState.isLogged);

const RoomIO = () => {
  return (
    <Router history={hashHistory}>
      <Route path="/graphiql" component={Graph} />
      { layoutState.isLogged ?
        <Route component={Layout}>
          <Route path="/" component={RoomFeed} />
          <Route path="profile" component={Profile} />
          <Redirect from="feed" to="/" />
          <Route path="start">
            <Route path="room" component={Room} />
            <Route path="stuffs" component={Room} />
          </Route>
        </Route>
        :
        <Route component={Layout}>
          <Route path="/" component={Welcome} />
          <Route path="feed" component={RoomFeed} />
          <Route path="start">
            <Route path="room" component={Room} />
            <Route path="stuffs" component={Room} />
          </Route>
        </Route>
      }
    </Router>
  );
}


export function loadApp() {
  ReactDOM.render(
    <RoomIO />,
    document.getElementById('app')
  );
}

loadApp();

import './index.scss';
import '../node_modules/graphiql/graphiql.css'