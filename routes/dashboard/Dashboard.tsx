import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

// Dashboard
import Timeline from './visuals/Timeline';
import OrderList from './visuals/OrderList';




@observer
export default class Dashboard extends React.Component< any, any > {
  
  componentWillMount() {

  }

  render() {
    return (
      <div>
        <Timeline/>
        <OrderList/>
      </div>
    );
  }
}


// import 'component.scss'