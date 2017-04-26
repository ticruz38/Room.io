import * as React from 'react';
import { Link } from 'react-router';
import * as mobx from 'mobx';
import * as moment from 'moment';
import { observer } from 'mobx-react';
import Loader from "graph/Loader";

// roomio
import { layoutState } from 'routes/layout/Layout';
import { EditableRoom } from "models";
import Timeline from './visuals/Timeline';
import OrderList from './visuals/OrderList';
import { SpinnerIcon } from 'components/icons';
import Select from 'components/Select';
import { Option } from "@types/react-select";

const Logger = require('logplease');
const logger = Logger.create('Dashboard');

const Document = require('./Dashboard.gql');

const secondPerDay = 24 * 60 * 60;





class DashboardState extends Loader {
    // filter order by...
    @mobx.observable filters: Option[] = [];

    @mobx.observable room: Room;

    @mobx.observable orders: Order[] = [];

    @mobx.computed get filterOrders() {
        if( !this.filters.length ) return this.orders;
        return this.orders.filter( order => {
            return !this.filters.some( option => {
                const value = JSON.parse( option.value );
                return !Object.keys(value).some( key => {
                    switch (key) {
                        case 'price':
                            console.log('price', order[key], value[key]);
                            return order[key] >= value[key];
                        case '_id':
                            return order[key] === value[key];
                        case 'client':
                            console.log('client', order[key], value[key]);
                            return order[key].name === value[key].name;
                        default:
                            // console.log(key, order[key], value[key]);
                            return !!order[key] === !!value[key];
                    } } )
            } )
        } ).sort( (a, b) => a.created > b.created ? 0 : 1 )
    }
    // the current time the timeline points to
    @mobx.observable currentTime: number = moment().unix();
    // the day the timeline is focused on
    @mobx.observable today: number = moment().startOf('day').unix();
    // timeline cursor position on x axis
    @mobx.observable x: number = (this.currentTime - this.today) / 10;

    @mobx.computed get options(): Option[] {
        const clients = {};
        return [
            { label: 'payed', value: '{ "payed": true }' },
            { label: 'treated', value: '{ "treated": true }' },
            { label: 'unpayed', value: '{ "payed": false }' },
            { label: 'untreated', value: '{ "treated": false }' },
            { label: 'price > 5', value: `{ "price": 5 }` },
            ...this.orders.map( o => ( { label: 'N°:'+o._id, value: `{ "_id": "${o._id}" }` } ) ),
            ...this.orders.filter( o => {
                if( clients[o.client.name] ) return false;
                clients[o.client.name] = 1;
                return true;
            } ).map( o => ( { label: 'client:'+ o.client.name, value: `{ "client": {"name": "${o.client.name}" } }` } ) )
        ]
    }

    get select() {
        return <Select values={ this } />
    }
    // handle the onWheel event
    onWheel = (event) => {
        event.preventDefault();
        event.stopPropagation();
        // we scrolled back to the previous day
        if (this.x <= 0 && (event.deltaX < 0 || event.deltaY < 0)) {
            //this.currentTime -= secondPerDay;
            this.today -= secondPerDay;
            this.x = 8640;
        }
        // we scrolled forth to the next day
        if (this.x >= 8640 && (event.deltaX > 0 || event.deltaY > 0)) {
            //this.currentTime += secondPerDay;
            this.today += secondPerDay;
            this.x = 0;
        }
        this.x += event.currentTarget.id === 'timeline' ? event.deltaX : event.deltaY;
        this.currentTime = this.today + (this.x * 10);
    }
    //to be called once room is loaded
    watchOrders() {
        this.subscribe('WatchOrders', {
            variables: { roomId: this.room._id },
            contextValue: this,
            cb: (data: any) => {
                // logger.info('Subscribing order change')
                console.log(data);
            }
        }, 'addOrder', (payload) => payload.order.roomId === this.room._id );
    }
    loadRoom() {
        this.execute('RoomWithOrders', {
            variables: { userId: layoutState.user["_id"] },
            cb: (data: any) => {
                const { room } = data.user;
                if(!room) throw 'oop, room hasnt been fetched';
                this.room = room;
                this.orders = room.orders;
                this.watchOrders();
            }
        } )
    }
}

export const dashboardState = new DashboardState(Document);




@observer
export default class Dashboard extends React.Component<any, any> {
    componentWillMount() {
        layoutState.reset();
        layoutState.toolBar = [
            <Link to="/profile" className="btn">Profile</Link>,
            dashboardState.select
        ]
        layoutState.title = 'Dashboard';
        dashboardState.loadRoom()
    }

    render() {
        const { room } = dashboardState;
        if( !room ) return <SpinnerIcon />
        return (
            <div>
                <Timeline />
                <OrderList />
            </div>
        );
    }
}


// import 'component.scss'