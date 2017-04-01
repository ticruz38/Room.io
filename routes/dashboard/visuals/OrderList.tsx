import * as React from 'react';
import * as classnames from 'classnames';
import * as moment from 'moment';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

import { dashboardState } from '../Dashboard';




@observer
export default class OrderList extends React.Component<any, any> {

    get emptyList() {
        return (
            <div className="empty-list">
                <i className="material-icons">hot_tub</i>
                <p>You ain't got no order yet</p>
            </div>
        );
    }

    @mobx.computed get prevItems() {
        const { room, currentTime } = dashboardState;
        return room.orders.filter( ( o: Order ) => o.created < dashboardState.currentTime ).slice( -10 ).map(( o: Order, i ) =>
            <OrderComponent key={o._id} hidden={i > 5} order={o} />
        );
    }

    @mobx.computed get nextItems() {
        const { room } = dashboardState;
        return room.orders.filter(( o: Order ) => o.created > dashboardState.currentTime ).slice(0, 10).map(( o: Order, i ) =>
            <OrderComponent key={o._id} hidden={i > 5} order={o} />
        )
    }

    render() {
        console.log(dashboardState.room.orders);
        if( !this.prevItems.length && !this.nextItems.length) return this.emptyList;
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

class OrderComponent extends React.Component<OrderProps, any> {
    get stuffs(): any[][] { // [number, Stuff][]
        const map = {};
        console.log(mobx.toJS(this.props.order));
        this.props.order.stuffs.forEach( s => map[s._id] ? map[s._id]++ : map[s._id] = 1 );
        return Object.keys(map).map( key => ( [ map[key], this.props.order.stuffs.find( s => s._id === key ) ] ) )
    }

    componentWillUnmount = () => {
        const Order: any = this.refs['order']
        Order.className = 'leave';
    };

    render() {
        const order: Order = this.props.order;
        const createItem = ( s: Stuff ) => {
            console.log(s)
            return (
                <div key={s[1]._id} className="order-stuff">
                    { s[0] > 1 ? <i className="times">{s[0]}</i> : null }
                    <strong>{s[1].name}</strong>
                </div>
            );
        };
        return (
            <div ref='order'
                className={classnames( 'order-component', { hidden: this.props.hidden } )} 
            >
                <small className="order-number">{order._id}</small>
                <small className="order-created">{ moment.unix(order.created).fromNow() }</small>
                <h1>{order.client.name}<span className='price'>{order.amount + ' mB'}</span></h1>
                <div className="items">
                    {this.stuffs.map( createItem )}
                </div>
                <span className='cursor-payed'>
                    Payed <input type="checkbox" checked={order.payed} onChange={_ => order.payed = !order.payed} />
                </span>
                <span className='cursor-treated'>
                    Treated <input type="checkbox" checked={order.treated} onChange={_ => order.treated = !order.treated} />
                </span>
            </div>
        );
    }
}

import './OrderList.scss';