import * as React from "react";
import * as classnames from 'classnames';

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
}

export class RoomState extends Loader {
  @observable room: Room
  @observable caddy: Stuff[] = [];

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
    layoutState.onClose = () => this.props.router.push({pathname: '/'})
    this.roomState.room = this.props.room;
    this.roomState.execute('OnlyRoomStuffs', { variables: { "id": this.props.params.roomId } } )
  }

  renderStuffs(): React.ReactElement< any > | React.ReactElement< any >[] {
    const { room, caddy, amount } = this.roomState;
    if( !room.stuffs ) return <SpinnerIcon size={'5em'} />;
      return Object.keys(this.roomState.categories).map(key => (
          <div className="category">
            <h4>{key}</h4>
            <div key={key} className='stuffs'>
            { this.roomState.categories[key].map(s =>
                <div key={s._id} className="stuff" onClick={ _ => this.roomState.addCaddyItem(s) }>
                  <h4>
                    <span>{s.name}</span>
                  </h4>
                  <div>{s.description}</div>
                </div>
              ) }
            </div>
          </div>
      ) );
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
            { caddy.length ? <button className="btn">Order</button> : null }
          </div>
        </div>
        <p className="room-description">{room.description}</p>
        { this.renderStuffs() }
        { caddy.length ? <Caddy roomState={this.roomState} /> : <span/> }
      </div>
    );
  }
}


import './FullScreenRoom.scss';
