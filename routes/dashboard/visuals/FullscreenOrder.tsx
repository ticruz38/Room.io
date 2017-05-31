import * as React from 'react';
import * as moment from 'moment';

import IpfsImage from 'components/IpfsImage';
import { EditableOrder } from "models";

type Props = {
    order: Order,
    roomId: string
}

export default class FullscreenOrder extends React.Component<Props, any> {

    get amount(): number {
        return this.props.order.stuffs.reduce( (acc, cur) => acc += cur.price, 0 )
    }

    get stuffs(): any[][] { // [number, Stuff][]
        const map = {};
        this.props.order.stuffs.forEach( s => map[s._id] ? map[s._id]++ : map[s._id] = 1 );
        return Object.keys(map).map( key => ( [ map[key], this.props.order.stuffs.find( s => s._id === key ) ] ) )
    }

    save() {
        this.editableOrder.update();
    }

    editableOrder = new EditableOrder(this.props.order, null, this.props.roomId)

    render(): React.ReactElement< any > {
        const createItem = ( s: Stuff ) => {
            return (
                <div key={s[1]._id} className="order-stuff">
                    { s[0] > 1 ? <i className="times">{s[0]}</i> : null }
                    <strong>{s[1].name}</strong>
                </div>
            );
        };

        return (
            <div className="fullscreen-order">
                <div className="header">
                    <small className="order-number">{this.props.order._id}</small>
                    <small className="this.props.order-created">{ moment.unix(this.props.order.created).fromNow() }</small>
                </div>
                <h1>
                    {this.props.order.client.name}
                    <IpfsImage 
                        className="client-picture"
                        defaultPicture="http://www.neozone.org/blog/wp-content/uploads/2011/02/stormtrooper.jpg" 
                        urlPicture={this.props.order.client.picture}
                        readOnly
                    />
                </h1>
                <div className="items">
                    {this.stuffs.map( createItem )}
                </div>
                <div className="actions">
                    <strong className='price'>{this.amount ? this.amount + 'Rc': 'Free'}</strong>
                    <div className="action-btn">
                        <span className="cursor">
                            <span>Payed</span> {
                                this.editableOrder.payed ?
                                <i className="material-icons" onClick={ _ => { this.editableOrder.payed = false; this.save() } }>check_box</i> :
                                <i className="material-icons" onClick={ _ => { this.editableOrder.payed = true; this.save() } } >check_box_outline_blank</i>
                            }
                        </span>
                        <span className="cursor">
                            <span>Treated</span> {
                                this.editableOrder.treated ?
                                <i className="material-icons" onClick={ _ => { this.editableOrder.treated = 0; this.save() } }>check_box</i> :
                                <i className="material-icons" onClick={ _ => { this.editableOrder.treated = moment().unix(); this.save() } }>check_box_outline_blank</i>
                            }
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

import './FullscreenOrder.scss';