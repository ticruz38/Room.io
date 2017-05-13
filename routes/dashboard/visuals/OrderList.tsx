import * as React from 'react';
import * as classnames from 'classnames';
import * as moment from 'moment';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { TransitionMotion, spring, presets } from 'react-motion';

import { dashboardState } from '../Dashboard';
import OrderComponent from './OrderComponent';
import { EditableOrder } from "models";




@observer
export default class OrderList extends React.Component<{}, any> {

    get emptyList() {
        return (
            <div className="empty-list">
                <i className="material-icons">hot_tub</i>
                <p>You ain't got no order yet</p>
            </div>
        );
    }

    @mobx.computed get prevItems() {
        const { room, currentTime, filterOrders } = dashboardState;
        return filterOrders.filter( ( o: Order ) => o.created < currentTime ).slice( -5 ).map(( o: Order, i ) =>
            <OrderComponent key={o._id} order={o} roomId={room._id} />
        );
    }

    @mobx.computed get nextItems() {
        const { room, currentTime, filterOrders } = dashboardState;
        return filterOrders.filter( ( o: Order ) => o.created > currentTime ).slice(0, 5).map(( o: Order, i ) =>
            <OrderComponent key={o._id} order={o} roomId={room._id} />
        )
    }

    render() {
        if( !this.prevItems.length && !this.nextItems.length) return this.emptyList;
        return (
            <div className="dashboard">
                <div id="dashboard" className="container" onWheel={dashboardState.onWheel}>
                        {[...this.prevItems,
                        ...this.nextItems]}
                </div>
            </div>
        );
    }
}
