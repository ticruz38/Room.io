import * as React from 'react';
import { graphql } from 'graphql';

import Schema from 'graph';


const Graphiql = require('graphiql');

const Graph = _ => (
  <Graphiql
    fetcher={graphqlParams => {
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
)



export default {
  childRoutes: [ {
    component: require('./layout/Layout').default,
    childRoutes: [
      { path: 'graphiql', component: Graph },
      require('./profile'),
      require('./rooms'),
      require('./start'),
      require('./welcome'),
    ]
  } ]
}


import './index.scss';
import '../node_modules/graphiql/graphiql.css'