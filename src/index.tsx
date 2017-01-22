import * as React from 'react';
import * as ReactDOM from "react-dom";
import {graphql} from 'graphql';

import * as ReactRouter from 'react-router';

import { RoomFeed } from './rooms/RoomFeed';
import { Welcome } from './welcome/Welcome';
import { Layout } from './tools/Layout';
import { RoomView } from './start/Room';
import { Room } from './start/Stuffs';
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

const { Router, Route, Link, hashHistory } = ReactRouter;


ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/graphiql" component={Graph} />
      <Route component={Layout}>
        <Route path="/feed" component={RoomFeed} />
        <Route path="/room" component={RoomView}/>
        <Route path="/stuffs" component={Room}/>
        <Route path="/" component={Welcome}/>
      </Route>
    </Router>,
    document.getElementById("app")
);

import './index.scss';
import '../node_modules/graphiql/graphiql.css'