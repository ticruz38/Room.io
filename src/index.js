import * as React from 'react';
import * as ReactDOM from "react-dom";

import * as ReactRouter from 'react-router';

import { Layout } from '../crankshaft/layout';
import { StartBusiness} from './form/StartBusiness';

const { Router, Route, Link, browserHistory } = ReactRouter;

ReactDOM.render(
    <Router history={browserHistory}>
      <Route component={Layout} >
        <Route path="/" component={StartBusiness}/>
      </Route>
    </Router>,
    document.getElementById("app")
);

import './index.scss';