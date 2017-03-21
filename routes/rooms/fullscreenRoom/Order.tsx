import * as React from "react";
import { Link } from 'react-router';

import { Input } from 'components/form';

import { RoomState } from './FullscreenRoom';

type props = {
    roomState: RoomState
    params: any
}

export class Order extends React.Component<props, any> {
    render() {
        const { roomState } = this.props;
        return (
            <div className="order">
                <h3>You are about to order </h3>
                <table>
                    <thead>
                        <tr>
                            <td>category</td>
                            <td>name</td>
                            <td>description</td>
                            <td>price</td>
                        </tr>
                    </thead>
                    <tbody>
                        {roomState.stuffs.map( s =>
                            <tr>
                                <td>{s.category}</td>
                                <td>{s.name}</td>
                                <td>{s.description}</td>
                                <td>{s.price || 'free'}</td>
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
                    <Link to={ "/" + this.props.params.roomId } className="btn">Cancel</Link>
                    <button className="btn">Order</button>
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