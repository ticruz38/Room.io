import * as React from "react";
import * as classnames from 'classnames';
import { Link } from 'react-router';
import {computed, observable, toJS, autorun} from 'mobx'
import { observer } from 'mobx-react';
import { SpinnerIcon, EthereumIcon } from 'components/icons';
import Loader from 'graph/Loader';


//layout
import { layoutState } from 'routes/layout/Layout';

import Caddy from './visuals/caddy';

const Document = require('./FullScreenRoom.gql');



interface props {
  room: Room,
  params: any;
  router: any;
  children: any;
}

export class RoomState extends Loader {
  @observable room: Room
  @observable caddy: Stuff[] = [];
  @observable message: string;

  @computed get amount(): number {
    return this.caddy.reduce((prev, cur) => prev + cur.price || 0, 0 )
  }

  // stuff listed by categories
  @computed get categories(): {string?: Stuff[]} {
    const categories: {string?: Stuff[]} = {};
    this.room.stuffs.map(s => categories[s.category] ? categories[s.category].push(s) : categories[s.category] = [s])
    return categories;
  }

  @computed get caddyByCategories(): {string?: Stuff[]} {
    const categories: {string?: Stuff[]} = {};
    this.caddy.map(s => categories[s.category] ? categories[s.category].push(s) : categories[s.category] = [s])
    return categories;
  }

  addCaddyItem(stuff: Stuff) {
    this.caddy.push(stuff);
  }
}


@observer
export default class FullscreenRoom extends React.Component<props, RoomState> {

  roomState: RoomState = new RoomState(Document);

  componentWillMount() {
    layoutState.onClose = () => this.props.router.push( { pathname: '/' } )
    this.roomState.room = this.props.room;
    this.roomState.execute('OnlyRoomStuffs', { variables: { "id": this.props.params.roomId } } )
  }

  render() {
    const { room, caddy, amount } = this.roomState;
    if( !room ) return <SpinnerIcon size="5em" />;
    return (
      <div className='full-screen' onClick={ e => e.stopPropagation() }>
        <div className='room-bar'>
          <h1>{room.name}</h1>
          <div className='right-buttons'>
            <div>{amount} <EthereumIcon/> </div>
            <div className="chat"><i className="material-icons">chat</i></div>
            { caddy.length ? <Link to={ 'rooms/' + this.props.params.roomId + '/order' } className="btn">Order</Link> : null }
          </div>
        </div>
        <p className="room-description">{ room.description }</p>
        { React.cloneElement( this.props.children, { roomState: this.roomState } ) }
      </div>
    );
  }
}


import './FullScreenRoom.scss';
