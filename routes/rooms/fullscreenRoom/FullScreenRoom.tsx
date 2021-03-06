import * as React from "react";
import * as classnames from 'classnames';
import { Link } from 'react-router';
import { computed, observable, toJS, autorun } from 'mobx'
import { observer } from 'mobx-react';

// roomio
import { SpinnerIcon, EthereumIcon } from 'components/icons';
 import { Button } from "components";
import Loader from 'graph/Loader';
import { layoutState } from 'routes/layout/Layout';
import { EditableOrder } from "models";



const Document = require( './FullScreenRoom.gql' );



interface props {
    room: Room,
    params: any;
    location: any;
    router: any;
    children: any;
}

export class RoomState extends Loader {
    @observable room: Room;
    @observable order: EditableOrder;

    @computed get amount(): number {
        return this.order.stuffIds.reduce( ( acc, cur ) => {
            const currentRoom = this.room.stuffs.find( s => s._id === cur );
            return acc + currentRoom.price || 0
        }, 0);
    }

    @computed get stuffs(): any[][] { // [number, Stuff][]
        const map = {};
        this.order.stuffIds.forEach( id => map[id] ? map[id]++ : map[id] = 1 );
        return Object.keys(map).map( key => ( [ map[key], this.room.stuffs.find( s => s._id === key ) ] ) )
    }
    // stuff listed by categories
    @computed get categories(): { string?: Stuff[] } {
        const categories: { string?: Stuff[] } = {};
        ( this.stuffs || [] ).map( s => categories[s[1].category] ? categories[s[1].category].push( s ) : categories[s[1].category] = [s] )
        return categories;
    }

    @computed get roomCategories(): { string?: Stuff[] } {
        const categories: { string?: Stuff[] } = {};
        ( this.room.stuffs || [] ).map( s => categories[s.category] ? categories[s.category].push( s ) : categories[s.category] = [s] )
        return categories;
    }

    constructor( roomId ) {
        super(Document);
        this.order = layoutState.user ? new EditableOrder(null, layoutState.user._id, roomId ) : null;
        this.loadRoom( roomId );
    }

    loadRoom(roomId: string) {
        this.execute('RoomQuery', {
            variables: { id: roomId },
            cb: (data: any) => {
                const { room } = data;
                if (!room) throw 'oops, room hasnt been fetched';
                this.room = room;
            }
        });
    }
}


@observer
export default class FullscreenRoom extends React.Component<props, RoomState> {

    roomState: RoomState = new RoomState( this.props.params.roomId );

    componentWillMount() {
        layoutState.onClose = () => this.props.router.push( { pathname: '/rooms' } )
        this.roomState.room = this.props.room;
    }
    // the button on the top left order screen
    get orderButton() {
        const { order } = this.roomState;
        if ( order && order.stuffIds.length && !this.props.location.pathname.includes('/order') ) {
            return (
                <Button
                    message='Order'
                    to={'rooms/' + this.props.params.roomId + '/order'} 
                />
            );
        }
        if ( this.props.location.pathname.includes('/order') ) {
            return (
                <Button
                    message='Cancel'
                    to={'rooms/' + this.props.params.roomId} 
                />
            )
        }
    }

    @computed get logNeeded() {
        return layoutState.user ? 
            null :
            <p className="warning-message">You need to be logged in to pass an order</p>
    }

    render() {
        const { room, order } = this.roomState;
        if ( !room ) return <SpinnerIcon size="5em" />;
        return (
            <div className='full-screen' onClick={e => e.stopPropagation()}>
                <div className='room-bar'>
                    <h1>{room.name}</h1>
                    <div className='right-buttons'>
                        { order ? <div>{ this.roomState.amount} <EthereumIcon /> </div> : null }
                        { this.orderButton }
                    </div>
                </div>
                <p className="room-description">{ room.description }</p>
                { this.logNeeded }
                { React.cloneElement( this.props.children, { roomState: this.roomState } )}
            </div>
        );
    }
}


import './FullScreenRoom.scss';

