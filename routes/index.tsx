import * as React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { graphql } from 'graphql';

import { Layout } from 'routes/layout';
import { Welcome } from 'routes/welcome';
import { RoomFeed, FullScreenRoom, Order, RoomContent } from 'routes/rooms';
import { Profile } from 'routes/profile';
import { Dashboard } from 'routes/dashboard';
import { Tables } from 'routes/tables';

import Schema from 'graph';
import * as generate from 'mocks/Generate'; // just to get the window method dropDb, populateDb

const Graphiql = require('graphiql');

// mock features
window["dropDb"] = generate.DropDb;
window["populateDb"] = generate.PopulateDb;

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
        } }
        schema={Schema}
    />
)
            
export default (
    <Router history={ hashHistory }>
        <Route path="/" component={ Welcome } />
        <Route component={Layout}>
            <Route path="/graphiql" component={ Graph } />
            <Route path="/profile" component={ Profile } />
            <Route path="/dashboard" component={ Dashboard} />
            <Route path="/rooms" component={ RoomFeed } >
                <Route path=":roomId" component={ FullScreenRoom }>
                    <IndexRoute component={ RoomContent} />
                    <Route path="order" component={ Order } />
                </Route>
            </Route>
            <Route path="tables" component={ Tables } />
        </Route>
    </Router>
)


import 'react-select/dist/react-select.css';
import '../node_modules/graphiql/graphiql.css'
import './index.scss';