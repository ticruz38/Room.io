import * as React from "react";

import {computed, observable, toJS, autorun} from 'mobx'

import * as classnames from 'classnames';

import {
  RoomFeedState, Room, Stuff
} from './RoomFeed';

import Caddy from './caddy';

import { observer } from 'mobx-react';

interface props {
  room: Room,
  close: () => void
}

export class RoomState {
  @observable selectedStuff: Stuff
  @observable caddy: Stuff[] = [];

  @computed get amount(): number {
    return this.caddy.reduce((prev, cur) => prev + cur.price || 0, 0 )
  }
}

export const roomState = new RoomState();

@observer
export default class FullscreenRoom extends React.Component<props, any> {

  /** refresh caddy any time selected room change */
  refreshCaddy = autorun( () => {
    this.props.room;
    roomState.caddy = [];
  })
  
  get selectedStuff() {
    return roomState.selectedStuff || this.props.room.stuffs[0];
  }

  addCaddyItem = (stuff: Stuff) => {
    let newStuff = Object.assign({}, stuff); // send a new object instance here
    roomState.caddy.push(newStuff);
  }

  render() {
    const Stuff = (props: Stuff) => {
      return (
        <tr className='row'>
          <td className='stuff-name'>{props.name}</td>
          <td className='stuff-description'>{props.description}</td>
          <td className='caddy-icon'><i onClick={ () => this.addCaddyItem( props ) } className="material-icons">add_shopping_cart</i></td>
        </tr>
      );
    } 
    
    const {room} = this.props;
    
    return (
      <div className='full-screen-wrapper' onClick={ this.props.close }>
        <div className='full-screen' onClick={ e => e.stopPropagation() }>
          <div className='room-bar'>
            <h1>{room.name}</h1>
            <div className='right-buttons'>
              <div>{roomState.amount} <svg viewBox="0 0 16 16" height='24px' fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><path d="M7.963 11.98l-4.91-2.9L7.962 16l4.914-6.92-4.914 2.9zM8.037 0l-4.91 8.148 4.91 2.903 4.91-2.902L8.038 0z" fill="#010101"/></svg></div>
              { roomState.caddy.length ? <div>Order</div> : <span/> }
              <div className="chat">Chat <i className="material-icons">chat</i></div>
            </div>
          </div>
          <p className="room-description">{room.description}</p>
          <img src={room.picture}/>
          <div className='room-stuffs'>

          </div>
          {roomState.caddy.length ? <Caddy roomState={roomState} /> : <span/>}
        </div>
      </div>
    )
  }
}


import './FullScreenRoom.scss';
