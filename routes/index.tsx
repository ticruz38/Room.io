import * as React from 'react';
import { graphql } from 'graphql';

import Layout from './layout/Layout';
import Schema from 'graph';
import generate from 'mocks/Generate'; // just to get the window method dropDb, populateDb

console.log(generate);
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
    component: Layout,
    childRoutes: [
        { path: 'graphiql', component: Graph },
        {
            path: 'profile',
            getComponent(location, cb) {
                System.import('./profile/Profile.tsx')
                .then( (module) => cb( null, module.default ) )
                .catch(err => console.error(err) );
            }
        },
        require('./rooms'),
        require('./welcome'),
        require('./dashboard'),
        require('./tables')
    ]
}


import 'react-select/dist/react-select.css';
import '../node_modules/graphiql/graphiql.css'
import './index.scss';