import * as React from 'react';
import * as classnames from 'classnames';
import * as mobx from 'mobx';
import * as moment from 'moment';
import Loader from 'graph/Loader';
import { observer } from 'mobx-react';

import { EditableOrder } from "models";


@observer
export default class OrderComponent extends React.Component<{order: Order, roomId: string }, any> {

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
        const createItem = ( s: Stuff ) => {
            return (
                <div key={s[1]._id} className="order-stuff">
                    { s[0] > 1 ? <i className="times">{s[0]}</i> : null }
                    <strong>{s[1].name}</strong>
                </div>
            );
        };
        return (
            <div ref="order"
                className="order-component"
            >
                <small className="order-number">{this.props.order._id}</small>
                <small className="this.props.order-created">{ moment.unix(this.props.order.created).fromNow() }</small>
                <h3>{this.props.order.client.name}<span className='price'>{this.amount ? this.amount + 'Rc': 'Free'}</span></h3>
                <div className="flex">
                    <div className="items">
                        {this.stuffs.map( createItem )}
                    </div>
                    <div className="actions">
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
            </div>
        );
    }
}

import './OrderComponent.scss';