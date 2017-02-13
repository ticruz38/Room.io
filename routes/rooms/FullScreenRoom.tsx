import * as React from "react";
import * as classnames from 'classnames';

import {computed, observable, toJS, autorun} from 'mobx'
import { observer } from 'mobx-react';
import { SpinnerIcon, EthereumIcon } from 'components/icons';
import Loader from 'graph/Loader';
import { RoomFeedState, Room, Stuff } from './RoomFeed';

import Caddy from './caddy';

const Document = require('./FullScreenRoom.gql');



interface props {
  room: Room,
  close: () => void
}

export class RoomState extends Loader {
  @observable selectedStuff: Stuff;
  @observable room: Room;
  @observable caddy: Stuff[] = [];

  @computed get amount(): number {
    return this.caddy.reduce((prev, cur) => prev + cur.price || 0, 0 )
  }
}


@observer
export default class FullscreenRoom extends React.Component<props, any> {

  roomState: RoomState = new RoomState(Document);

  componentWillMount() {
    this.roomState.room = this.props.room;
    this.roomState.execute('OnlyRoomStuffs', { variables: { "id": this.props.room._id } } )
  }

  /** refresh caddy any time selected room change */
  refreshCaddy = autorun( () => {
    this.props.room;
    this.roomState.caddy = [];
  } )
  
  get selectedStuff() {
    return this.roomState.selectedStuff || this.props.room.stuffs[0];
  }

  addCaddyItem = (stuff: Stuff) => {
    let newStuff = Object.assign({}, stuff); // send a new object instance here
    this.roomState.caddy.push(newStuff);
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
    
    const {room} = this.roomState;
    
    return (
      <div className='full-screen-wrapper' onClick={ this.props.close }>
        <div className='full-screen' onClick={ e => e.stopPropagation() }>
          <div className='room-bar'>
            <h1>{room.name}</h1>
            <div className='right-buttons'>
              <div>{this.roomState.amount} <EthereumIcon/> </div>
              { this.roomState.caddy.length ? <div>Order</div> : <span/> }
              <div className="chat"><i className="material-icons">chat</i></div>
            </div>
          </div>
          <p className="room-description">{room.description}</p>
          <img src={room.picture}/>
          <div className='room-stuffs'>
            { !room.stuffs ? <SpinnerIcon size={'5em'}/> : room.stuffs.map( s => 
              <div className='stuff' style={ { background: `url( ${s.picture} )`} }>
                <h5>{ s.name }</h5>
                <small>{ s.description }</small>
                <strong>{ s.price }</strong>
              </div>
            ) }
          </div>
          {this.roomState.caddy.length ? <Caddy roomState={this.roomState} /> : <span/>}
        </div>
      </div>
    );
  }
}


import './FullScreenRoom.scss';
