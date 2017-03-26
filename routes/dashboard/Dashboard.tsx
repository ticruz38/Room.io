import * as React from 'react';
import { Link } from 'react-router';
import * as mobx from 'mobx';
import * as moment from 'moment';
import { observer } from 'mobx-react';
import Loader from "graph/Loader";

//layout
import { layoutState } from 'routes/layout/Layout';

// Dashboard
import Timeline from './visuals/Timeline';
import OrderList from './visuals/OrderList';

const document = require('./Dashboard.gql');

const secondPerDay = 24 * 60 * 60;




class DashboardState extends Loader {
  // filter order by...
  @mobx.observable filterBy: { payed: boolean, treated: boolean } = {
    payed: false,
    treated: false
  }
  @mobx.observable orders: Order[] = [];
  // the current time the timeline points to
  @mobx.observable currentTime: number = moment().unix();
  // the day the timeline is focused on
  @mobx.observable today: number = moment().startOf('day').unix();
  // timeline cursor position on x axis
  @mobx.observable x: number = (this.currentTime - this.today) / 10;
  // handle the onWheel event
  onWheel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // we scrolled back to the previous day
    if (this.x <= 0 && (event.deltaX < 0 || event.deltaY < 0)) {
      //this.currentTime -= secondPerDay;
      this.today -= secondPerDay;
      this.x = 8640;
    }
    // we scrolled forth to the next day
    if (this.x >= 8640 && (event.deltaX > 0 || event.deltaY > 0)) {
      //this.currentTime += secondPerDay;
      this.today += secondPerDay;
      this.x = 0;
    }
    this.x += event.currentTarget.id === 'timeline' ? event.deltaX : event.deltaY;
    this.currentTime = this.today + (this.x * 10);
  }
  loadOrders() {

  }
}

export const dashboardState = new DashboardState();




@observer
export default class Dashboard extends React.Component<any, any> {

  componentWillMount() {
    layoutState.reset();
    layoutState.toolBar = <Link to="/profile" className="btn">Profile</Link>
    layoutState.title = 'Dashboard';
  }

  render() {
    return (
      <div>
        <Timeline />
        <OrderList />
      </div>
    );
  }
}


// import 'component.scss'