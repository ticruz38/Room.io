import * as React from 'react';
import * as classnames from 'classnames';
import * as moment from 'moment';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

import { dashboardState } from '../Dashboard';
import { EditableOrder } from "models";




@observer
export default class OrderList extends React.Component<OrderProps, any> {

    get emptyList() {
        return (
            <div className="empty-list">
                <i className="material-icons">hot_tub</i>
                <p>You ain't got no order yet</p>
            </div>
        );
    }

    get sortedOrders() {
        return dashboardState.room.orders.sort( (a, b) => a.created > b.created ? 0 : 1 );
    }

    @mobx.computed get prevItems() {
        const { room, currentTime, filterOrders } = dashboardState;
        return filterOrders.filter( ( o: Order ) => o.created < currentTime ).slice( -10 ).reverse().map(( o: Order, i ) =>
            <OrderComponent key={o._id} hidden={i > 5} order={o} roomId={room._id} />
        );
    }

    @mobx.computed get nextItems() {
        const { room, currentTime, filterOrders } = dashboardState;
        return filterOrders.filter( ( o: Order ) => o.created > currentTime ).slice(0, 10).map(( o: Order, i ) =>
            <OrderComponent key={o._id} hidden={i > 5} order={o} roomId={room._id} />
        )
    }

    render() {
        if( !this.prevItems.length && !this.nextItems.length) return this.emptyList;
        return (
            <div className="dashboard">
                <div id='dashboard' className='container' onWheel={dashboardState.onWheel}>
                    {this.prevItems}
                    <div className="line"/>
                    {this.nextItems}
                </div>
            </div>
        );
    }
}


interface OrderProps {
    hidden: boolean,
    order: Order,
    roomId: string
}

@observer
class OrderComponent extends React.Component<OrderProps, any> {
    get stuffs(): any[][] { // [number, Stuff][]
        const map = {};
        this.props.order.stuffs.forEach( s => map[s._id] ? map[s._id]++ : map[s._id] = 1 );
        return Object.keys(map).map( key => ( [ map[key], this.props.order.stuffs.find( s => s._id === key ) ] ) )
    }

    get amount(): number {
        return this.props.order.stuffs.reduce( (acc, cur) => acc += cur.price, 0 )
    }

    editableOrder = new EditableOrder(this.props.order, null, this.props.roomId)

    save() {
        this.editableOrder.update();
    }

    componentWillUnmount = () => {
        const Order: any = this.refs['order']
        Order.className = 'leave';
    };

    render() {
        const order: Order = this.props.order;
        const createItem = ( s: Stuff ) => {
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
                <h3>{order.client.name}<span className='price'>{this.amount ? this.amount + 'Rc': 'Free'}</span></h3>
                <div className="items">
                    {this.stuffs.map( createItem )}
                </div>
                <div className="foot-bar">
                    <span>Payed</span> {
                        this.editableOrder.payed ?
                        <i className="material-icons" onClick={ _ => { this.editableOrder.payed = false; this.save() } }>check_box</i> :
                        <i className="material-icons" onClick={ _ => { this.editableOrder.payed = true; this.save() } } >check_box_outline_blank</i>
                    }
                    <span>Treated</span> {
                        this.editableOrder.treated ?
                        <i className="material-icons" onClick={ _ => { this.editableOrder.treated = 0; this.save() } }>check_box</i> :
                        <i className="material-icons" onClick={ _ => { this.editableOrder.treated = moment().unix(); this.save() } }>check_box_outline_blank</i>
                    }
                    <i className="material-icons">open_with</i>
                </div>
            </div>
        );
    }
}

import './OrderList.scss';
