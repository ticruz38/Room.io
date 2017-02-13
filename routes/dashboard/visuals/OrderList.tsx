import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

class OrderState {

}

@observer
export default class OrderList extends React.Component< any, any > {
  render() {
    return (
      <div/>
    );
  }
}

/*class Dashboard extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    var i = 0;
     * A function to return only the 5 next order after timeLineDate
     * @param  {[object]} order [description]
     * @param  {[int]} index [description]
     * @return {[react element]}       []
    var prevOrder = () => {
      var orders = [];
      this.props.orders.reverse();
      this.props.orders.map(order => {
        if (timeLineDate.getTime() >= order.node.date && i < 10) {
          i++;
          orders.push(<Order className={i <= 5 ? ' visible' : ''} key={order.node.id} order={order.node} restaurantID={this.props.restaurantID}/>);
        }
      });
      i = 0;
      return orders.reverse();
    }
    var postOrder = () => {
      var orders = [];
      this.props.orders.reverse();
      this.props.orders.map(order => {
        if (order.node.date >= timeLineDate.getTime() && i < 10) {
          i++;
          orders.push(<Order className={i <= 5 ? ' visible' : ''} key={order.node.id} order={order.node} restaurantID={this.props.restaurantID}/>);
        }
      });
      i = 0
      return orders;
    }
    var createOrder = (order, index) => {

      if (order.node.date >= timeLineDate.getTime() && i < 10) {
        i++
        return <Order className={i < 15 ? ' visible' : ''} key={order.node.id} order={order.node} restaurantID={this.props.restaurantID}/>;
      }
    };
    // var createOrder = () => {
    //   var prevTime = 1000;
    //   var prevOrder = [];
    //   var postOrder = [];
    // }
    return (
      <div className = "dashboard">
        <div id = 'dashboard' className = 'container' onWheel={timeLineWheel}>
          {prevOrder()}
          {postOrder()}
        </div>
      </div>
    );
  }
}

class Order extends React.Component {

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

// import 'component.scss'*/