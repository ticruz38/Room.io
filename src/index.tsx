import * as React from 'react';
import * as ReactDOM from "react-dom";
import {graphql} from 'graphql';

import { Router, Route, Link, hashHistory } from 'react-router';

import RoomFeed from './rooms/RoomFeed';
import Welcome from './welcome/Welcome';
import Layout from './layout/Layout';
import Room from './start/Room';
import Stuffs from './start/Stuffs';
import Schema from './graphql-client/Root';


const Graphiql = require('graphiql');

const Graph = _ =>
  <Graphiql
    fetcher={ graphqlParams => {
      //console.log(graphqlParams);
      return graphql(
        Schema,
        graphqlParams.query, 
        {},
        graphqlParams.variables, 
        graphqlParams.operationName
      ) }
    }
    schema={Schema}
  />


ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/graphiql" component={Graph} />
      <Route component={Layout}>
        <Route path="/" component={Welcome}/>
        <Route path="room" component={(prop) => {console.log(prop); return <span/> }} />
        <Route path="feed" component={RoomFeed} />
        <Route path="start">
          <Route path="room" component={Room}/>
          <Route path="stuffs" component={Room}/>
        </Route>
      </Route>
    </Router>,
    document.getElementById("app")
);

import './index.scss';
import '../node_modules/graphiql/graphiql.css'