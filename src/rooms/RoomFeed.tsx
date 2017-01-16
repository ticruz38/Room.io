import * as React                             from "react";

import {computed, observable, toJS, autorun}  from 'mobx'

import { observer }                           from 'mobx-react';

import graphStore                             from '../GraphStore';
import uiStore                                from '../UiStore';
import FullScreenRoom                         from './FullScreenRoom';
import { layoutState }                        from '../tools/Layout';
import Loader                                 from '../graphql-client/Loader';

const RoomDocument = require('./RoomFeed.gql');

interface RoomFeedProps {

}

export interface Meal {
  id: string;
  parent: string,
  name: string,
  description: string,
  length: number // this is used in caddy
}

export interface Food {
  id: string,
  name: string,
  description: string,
  meals: Meal[],
  picture: {
    url: string,
    size: number[]
  }
}

export interface Room {
  _id: string,
  name?: string,
  description?: string,
  stuffs: Food[]
  pictures: string[]
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
export class RoomFeed extends React.Component< RoomFeedProps, RoomFeedState > {

  modal() {
    layoutState.modal = <FullScreenRoom roomFeedState = {roomFeedState} />;
  }

  render(): React.ReactElement<any> {
    console.log(toJS(roomFeedState.rooms));
    
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
      </div>
    );
  }
}

const Room = (room: Room) =>
    <div className='room'>
      <img src={room.pictures ? room.pictures[0] : ''} onClick={_ => { roomFeedState.room = room } } />
      {/*<i>{room.reviews.count} {room.reviews.averageScore}</i>*/}
      <h2>{room.name}</h2>
      <p>{room.description}</p>
    </div>

import './RoomFeed.scss';


