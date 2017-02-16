import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

import { dashboardState } from '../Dashboard';



class OrderState {
  orders: Order[] = [];
}

@observer
export default class OrderList extends React.Component< any, any > {
  render() {
    return (
      <div/>
    );
  }
}

class Dashboard extends React.Component< any, any > {

  constructor(props, context) {
    super(props, context);
  }

  @mobx.computed get prevItems() {
    return dashboardState.orders.filter( (o: Order)  => o.created < dashboardState.current ).slice( -10 ).map( (o: Order, i) =>
      <OrderComponent hidden={i < 5} {...o} />
    );
  }

  @mobx.computed get nextItems() {
    return dashboardState.orders.filter( (o: Order)  => o.created > dashboardState.current ).slice( 0, 10 ).map( (o: Order, i) =>
      <OrderComponent hidden={i > 5} {...o} />
    )
  }

  render() {
    return (
      <div className = "dashboard">
        <div id = 'dashboard' className = 'container' onWheel={timeLineWheel}>
          { this.prevItems }
          { this.nextItems }
        </div>
      </div>
    );
  }
}

class OrderComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {expand: false};
  }

  _update = (e) => {
    e.stopPropagation();
    var order = {
      id: this.props.order.id,
      restaurantID: this.props.restaurantID
    };
    order[e.currentTarget.id] = !this.props.order[e.currentTarget.id];
    var onFailure = () => console.log('failure');
    var onSuccess = () => console.log('success');
    //Relay.Store.update(new UpdateOrderMutation({order: order}), {onFailure, onSuccess});
  };

  componentWillUnmount = () => {
    this.refs.order.className = 'leave';
    setTimeout(() => {
      console.log('leave');
     }, 250);
  };

  render() {
    var order = this.props.order;
    var createItem = (item) => {
      return (
        <div className = 'item'>
          {item.parent}<br/>
          {item.name}
        </div>
      );
    };
    var date = new Date(order.date);
    var Hours = date.getHours();
    var Minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return (
      <div className={'order' + this.props.className + (this.state.expand ? ' expand' : '')} ref='order' onClick={()=>{this.setState({expand: !this.state.expand});}} onWheel={(e) => {if(this.state.expand === true) e.stopPropagation();}}>
        <h1>{order.userName}<span className='price'>{order.price + ' mB'}</span><span className='time'>{Hours} : {Minutes}</span></h1>
        <div className={classnames('items', {hidden: !this.state.expand})}>
          {order.items.map(createItem)}
        </div>
        <span className = 'cursor-payed'>
          Payed <Cursor id={'payed'} on={order.payed} update={this._update}/>
        </span>
        <span className = 'cursor-treated'>
          Treated <Cursor id={'treated'} on={order.treated} update={this._update}/>
        </span>
      </div>
    );
  }
}

// import 'component.scss'