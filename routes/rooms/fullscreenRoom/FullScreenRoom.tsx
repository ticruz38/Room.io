import * as React from "react";
import * as classnames from 'classnames';
import { Link } from 'react-router';
import { computed, observable, toJS, autorun } from 'mobx'
import { observer } from 'mobx-react';

// roomio
import { SpinnerIcon, EthereumIcon } from 'components/icons';
import Loader from 'graph/Loader';
import { layoutState } from 'routes/layout/Layout';
import { EditableOrder } from "models";



const Document = require( './FullScreenRoom.gql' );



interface props {
    room: Room,
    params: any;
    router: any;
    children: any;
}

export class RoomState extends Loader {
    @observable room: Room;
    @observable order: EditableOrder;
    @computed get amount(): number {
        return this.stuffs.reduce( ( prev, cur ) => prev + cur.price || 0, 0 )
    }

    @computed get stuffs(): Stuff[] {
        return this.order.stuffIds.map( id => this.room.stuffs.find( s => s._id === id ) )
    }
    // stuff listed by categories
    @computed get categories(): { string?: Stuff[] } {
        const categories: { string?: Stuff[] } = {};
        this.room.stuffs.map( s => categories[s.category] ? categories[s.category].push( s ) : categories[s.category] = [s] )
        return categories;
    }

    constructor( roomId ) {
        super(Document);
        this.order = new EditableOrder(null, layoutState.user._id, roomId );
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

    render() {
        const { room, order, amount } = this.roomState;
        if ( !room ) return <SpinnerIcon size="5em" />;
        return (
            <div className='full-screen' onClick={e => e.stopPropagation()}>
                <div className='room-bar'>
                    <h1>{room.name}</h1>
                    <div className='right-buttons'>
                        <div>{amount} <EthereumIcon /> </div>
                        <div className="chat"><i className="material-icons">chat</i></div>
                        { order.stuffIds.length ? <Link to={'rooms/' + this.props.params.roomId + '/order'} className="btn">Order</Link> : null}
                    </div>
                </div>
                <p className="room-description">{ room.description }</p>
                { React.cloneElement( this.props.children, { roomState: this.roomState } )}
            </div>
        );
    }
}


import './FullScreenRoom.scss';
