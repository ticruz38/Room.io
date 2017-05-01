import * as React from "react";
import { Link } from 'react-router';

import { EditableOrder } from "models";
import { Input } from 'components/form';
import { layoutState } from "routes/layout/Layout";

import { RoomState } from './FullscreenRoom';

type props = {
    roomState: RoomState,
    router: any,
    params: any
}

export class Order extends React.Component<props, any> {

    onSave() {
        const { roomState } = this.props;
        roomState.order.create()
        roomState.order = new EditableOrder( null, layoutState.user._id, this.props.params.roomId);
        this.props.router.push( { pathname: '/rooms/' + this.props.params.roomId } )
    }
    render() {
        const { roomState } = this.props;
        return (
            <div className="order">
                <h3>You are about to order </h3>
                <table>
                    <thead>
                        <tr>
                            <td>times</td>
                            <td>category</td>
                            <td>name</td>
                            <td>description</td>
                            <td>price</td>
                        </tr>
                    </thead>
                    <tbody>
                        {roomState.stuffs.map( s =>
                            <tr>
                                <td>{s[0]}</td>
                                <td>{s[1].category}</td>
                                <td>{s[1].name}</td>
                                <td>{s[1].description}</td>
                                <td>{s[1].price || 'free'}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Input
                    type="text"
                    placeholder="Leave a comment"
                    field={ roomState.order.message }
                />
                <div className="buttons">
                    <Link to={ "/rooms/" + this.props.params.roomId } className="btn">Cancel</Link>
                    <button className="btn" onClick={ _ => this.onSave() }>Order</button>
                </div>
            </div>
        );
    }
}


export default {
    path: 'order',
    component: Order
}


import './Order.scss';