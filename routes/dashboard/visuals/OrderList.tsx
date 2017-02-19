import * as React from 'react';
import * as classnames from 'classnames';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

import { dashboardState } from '../Dashboard';



class OrderState {
  orders: Order[] = [];
}

@observer
export default class OrderList extends React.Component<any, any> {
  render() {
    return (
      <div />
    );
  }
}

class Dashboard extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);
  }

  @mobx.computed get prevItems() {
    return dashboardState.orders.filter((o: Order) => o.created < dashboardState.currentTime).slice(-10).map((o: Order, i) =>
      <OrderComponent hidden={i < 5} order={o} />
    );
  }

  @mobx.computed get nextItems() {
    return dashboardState.orders.filter((o: Order) => o.created > dashboardState.currentTime).slice(0, 10).map((o: Order, i) =>
      <OrderComponent hidden={i > 5} order={o} />
    )
  }

  render() {
    return (
      <div className="dashboard">
        <div id='dashboard' className='container' onWheel={dashboardState.onWheel}>
          {this.prevItems}
          {this.nextItems}
        </div>
      </div>
    );
  }
}


interface OrderProps {
  hidden: boolean,
  order: Order
}

class OrderComponent extends React.Component< OrderProps, any> {

  @mobx.observable state = {
    expand: false
  }

  constructor(props, context) {
    super(props, context);
    this.state = { expand: false };
  }

  componentWillUnmount = () => {
    const Order: any = this.refs['order']
    Order.className = 'leave';
  };

  render() {
    const order: Order = this.props.order;
    const createItem = (item: Stuff) => {
      return (
        <div className='item'>
          {item.category}<br />
          {item.name}
        </div>
      );
    };
    return (
      <div ref='order' 
        className={classnames( 'order', { hidden: this.props.hidden, expand: this.state.expand } ) } 
        onClick={() => this.state.expand = !this.state.expand }
        onWheel={ e => { if (this.state.expand === true) e.stopPropagation(); }}>
        <h1>{order.client.name}<span className='price'>{order.price + ' mB'}</span></h1>
        <div className={classnames('items', { hidden: !this.state.expand })}>
          {order.stuffs.map(createItem)}
        </div>
        <span className='cursor-payed'>
          Payed <input type="checkbox" checked={order.payed} onChange={ _ => order.payed = !order.payed } />
        </span>
        <span className='cursor-treated'>
          Treated <input type="checkbox" checked={order.treated} onChange={ _ => order.treated = !order.treated } />
        </span>
      </div>
    );
  }
}

// import 'component.scss'