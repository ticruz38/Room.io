import * as React from 'react';
import * as ReactDOM from "react-dom";
import {graphql} from 'graphql';

import * as ReactRouter from 'react-router';

import { RestaurantsFeed } from './restaurants/RestaurantsFeed';
import { Welcome } from './welcome/Welcome';
import { Layout } from './tools/Layout';
import { StartBusiness } from './start/StartBusiness';
import { Room } from './start/Room';
import Schema from './graphql-client/Root';


const Graphiql = require('graphiql');

const Graph = _ => 
  <Graphiql
    fetcher={ graphqlParams => {
      console.log(graphqlParams);
      return graphql(Schema, graphqlParams.query)
    } }
    schema={Schema}
  />

/*const Graphiql = React.createElement(graphiql, {
  schema: Schema
})*/

const { Router, Route, Link, hashHistory } = ReactRouter;


ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/graphiql" component={Graph} />
      <Route component={Layout}>
        <Route path="/start" component={StartBusiness}/>
        <Route path="/room" component={Room}/>
        <Route path="/" component={Welcome}/>
      </Route>
    </Router>,
    document.getElementById("app")
);

import './index.scss';
import '../node_modules/graphiql/graphiql.css'