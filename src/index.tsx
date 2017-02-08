import * as React from 'react';
import * as ReactDOM from "react-dom";
import { graphql } from 'graphql';
import { observer } from 'mobx-react';

import { Router, Redirect, Route, Link, hashHistory } from 'react-router';

import Schema from './graphql-client/Root';
import Layout from 'layout/Layout';


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



const rootRoute = {
  childRoutes: [ {
    path: '/',
    component: Layout,
    childRoutes: [
      require('./profile'),
      require('./rooms'),
      require('./start'),
      require('./welcome'),
    ]
  } ]
}



export function loadApp() {
  ReactDOM.render(
    <Router
      history={hashHistory}
      routes={ rootRoute }
    />,
    document.getElementById('app')
  );
}

loadApp();


/*const RoomIO = () => {
  return (
    <Router history={hashHistory}>
      <Route path="/graphiql" component={Graph} />
      { layoutState.isLogged ?
        <Route component={Layout}>
          <Redirect from="feed" to="/" />
          <Route path="/" component={RoomFeed} />
          <Route path="profile" component={Profile} />
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
}*/

import './index.scss';
import '../node_modules/graphiql/graphiql.css'