import * as React from "react";

import { computed, observable, toJS, autorun } from 'mobx'

import { observer } from 'mobx-react';

import uiStore from '../UiStore';
import { layoutState } from '../layout/Layout';
import { uintRandom } from 'mocks/Generate';
import Loader from 'graph/Loader';

const RoomDocument = require( './RoomFeed.gql' );

interface RoomFeedProps {
    router: any;
}


// the main component roomFeedState;
export class RoomFeedState extends Loader {

    @observable rooms: Room[] = [];

    @observable columnWidth: number = 200;

    @computed get numberOfColumn(): number {
        return Math.round( uiStore.windowSize[1] * 0.7 / roomFeedState.columnWidth );
    }
}

export const roomFeedState = new RoomFeedState( RoomDocument );

@observer
export default class RoomFeed extends React.Component<RoomFeedProps, RoomFeedState> {

    componentWillMount() {
        roomFeedState.execute('RoomsSubscription', {contextValue: roomFeedState});
        layoutState.reset();
        layoutState.title = 'Pick a Room you like';
        layoutState.modal = this.props.children;
    }

    componentWillReceiveProps() {
        layoutState.modal = this.props.children
    }

    render(): React.ReactElement<any> {
        //set the array of rooms array
        const columns: Room[][] = [];

        const columnsComponent = ( rooms: Room[], index: number ) => {
            return (
                <div className='column' key={index}>
                    {rooms.filter( room => !!room ).map( room =>
                        <RoomComponent 
                            key={room._id} 
                            onClick={roomId => this.props.router.push( { pathname: '/rooms/' + roomId } )} 
                            {...room} 
                        />
                    )}
                </div>
            );
        }
        //divide rooms array in n distinct array
        for ( let i = 0; i < roomFeedState.rooms.length; i++ ) {
            let column = columns[i % roomFeedState.numberOfColumn];
            column ? column.push( roomFeedState.rooms[i] ) : columns.push( [roomFeedState.rooms[i]] );
        }
        return (
            <div className='rooms-grid'>
                {columns.map( columnsComponent )}
            </div>
        );
    }
}

const RoomComponent = ( props: Room & { onClick: Function } ) => {
    return (
        <div className='room-item' style={{maxWidth: roomFeedState.columnWidth}}>
            <IpfsImage
                defaultPicture={`mocks/pictures/${uintRandom(9)}.png`}
                urlPicture={ props.picture }
                onClick={ e => props.onClick( props._id )}
                readOnly
            />
            <div>
                <h4>{props.name}</h4>
                <small>{props.description}</small>
            </div>
        </div>
    );
}

import './RoomFeed.scss';
import { IpfsImage } from "components";


