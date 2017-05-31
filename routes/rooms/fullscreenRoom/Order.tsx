import * as React from "react";
import { Link } from 'react-router';

import { EditableOrder } from "models";
import { Input } from 'components/form';
import { Button } from "components";
import { layoutState } from "routes/layout/Layout";
import uPort from 'graph/Uport';

import { RoomState } from './FullscreenRoom';

type props = {
    roomState: RoomState,
    router: any,
    params: any
}

export default class Order extends React.Component<props, any> {

    sendOrder = () => {
        const { roomState } = this.props;
        // roomState.order = new EditableOrder( null, layoutState.userId, this.props.params.roomId);
        roomState.order.create()
        this.props.router.push( { pathname: '/rooms/' + this.props.params.roomId } )
    }

    sendTransaction = () => {
        console.log(layoutState.userId);
        const web3 = uPort.getWeb3();
        web3.eth.sendTransaction({
            from: layoutState.userId,
            to:'0x159594122d4df7dc6ad32f770e2246c14df6b23c', 
            value: web3.toWei(0.0005, "ether")
        }, (err, result ) => {
            console.log(err, result );
        } )
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
                    <Button
                        message="Pay now"
                        className="valid"
                        action={ this.sendTransaction } 
                    />
                    <Button
                        message="Pay Later"
                        className="warning"
                        action={ this.sendOrder }
                    />
                </div>
            </div>
        );
    }
}


import './Order.scss';
