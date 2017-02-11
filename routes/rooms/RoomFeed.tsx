import * as React                             from "react";

import {computed, observable, toJS, autorun}  from 'mobx'

import { observer }                           from 'mobx-react';

import uiStore                                from '../UiStore';
import FullScreenRoom                         from './FullScreenRoom';
import { layoutState }                        from '../layout/Layout';
import Loader                                 from 'graph/Loader';

const RoomDocument = require('./RoomFeed.gql');

interface RoomFeedProps {

}

export interface Stuff {
  _id: string,
  name: string,
  description: string,
  picture: string,
  price: number
}

export interface Room {
  _id: string,
  name?: string,
  description?: string,
  stuffs: Stuff[]
  picture: string
  //reviews?: { count: number, averageScore: number },
}


// the main component roomFeedState;
export class RoomFeedState extends Loader {

  /** get next or prev sibling room */
  browseRoom: (prop: number) => void = (prop) => {
    this.room = this.rooms[this.rooms.findIndex(room => room._id === this.room._id) + prop ]
  }
  
  @observable rooms: Room[] = [];

  @observable columnWidth: number = 300;

  @observable room: Room; //selected room

  @computed get numberOfColumn(): number {
    return Math.round(uiStore.windowSize[1] / roomFeedState.columnWidth);
  }
}

export const roomFeedState = new RoomFeedState( RoomDocument, 'RoomsQuery' );

@observer
export default class RoomFeed extends React.Component< RoomFeedProps, RoomFeedState > {

  componentWillMount() {
    layoutState.title = 'Pick a Room you like';
  }

  @computed get fullScreenRoom(): React.ReactElement< any > {
    return roomFeedState.room ?
      <FullScreenRoom room={ roomFeedState.room } close={ () => roomFeedState.room = null } /> :
      <span/>
  }

  render(): React.ReactElement<any> {
    //set the array of rooms array
    const columns: Room[][] = [];

    const columnsComponent = (rooms: Room[], index: number) => {
      return (
        <div className='column' key={index}>
          { rooms.filter(room => !!room).map( room => <Room {...room} key={room._id} /> ) }
        </div>
      );
    }    
    //divide rooms array in n distinct array
    for (let i = 0; i < roomFeedState.rooms.length; i++) {
      let column = columns[i % roomFeedState.numberOfColumn];
      column ? column.push(roomFeedState.rooms[i]) : columns.push([roomFeedState.rooms[i]]);
    }
    return (
      <div className='rooms-grid'>
        { columns.map(columnsComponent) }
        { this.fullScreenRoom }
      </div>
    );
  }
}

const Room = (room: Room) => {
  return (
    <div className='room-item'>
      <img src={ room.picture ? room.picture : 'public/messy_room.jpg' } onClick={ _ => roomFeedState.room = room } />
      <h2>{room.name}</h2>
      <p>{room.description}</p>
    </div>
  );
}

import './RoomFeed.scss';


