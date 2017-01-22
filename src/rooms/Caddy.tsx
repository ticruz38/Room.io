import * as React                                   from "react";
import {computed, observable, toJS, autorun }       from 'mobx';
import { observer }                                 from 'mobx-react';
import * as classnames                              from 'classnames';

import { Room, Stuff }                         from './RoomFeed';

interface Item {
  id: string;
  parent: string,
  name: string,
  description: string,
  length?: number // length describe how many times the same item is ordered
}

@observer
export default class Caddy extends React.Component<any, any> {

  get roomState() {
    return this.props.roomState
  }
  
  /**
   * transform the caddy so that we get a map of FoodType with Items in it
   */ 
  @computed get newCaddy(): { [T: string]: Item[] } {
    let caddy = [...this.roomState.caddy]
    const u: { [T: string]: Item } = {};
    const v: { [T: string]: Item[] } = {};
    for (let i = 0; i < caddy.length; i++) {
      if (u.hasOwnProperty(caddy[i].name)) {
        u[caddy[i].name].length += 1;
        continue;
      }
      caddy[i].length = 1;
      u[caddy[i].name] = caddy[i];
      v[caddy[i].parent] ?
        v[caddy[i].parent].push(caddy[i]) :
        v[caddy[i].parent] = [caddy[i]];
    }    
    return v;
  }

  removeItem(id: string) {
    this.roomState.caddy.splice( this.roomState.caddy.findIndex((item: Stuff) => item._id === id), 1 );
  }


  renderItems(items: Item[]) {
    return items.map(item => {
      return (
        <div className='caddy-item' key={ item.id }>
          <div>
            <span>{item.length > 1 ? item.length + 'X' : ''}</span>
            <i onClick={_ => this.removeItem(item.id)} className="material-icons">close</i>
          </div>
            <strong>{item.name}</strong>
          </div>
      );
    } )
  }

  get renderCaddy() {
    const caddy: React.ReactElement< any >[] = [];
    for (const key in this.newCaddy) {
      caddy.push(
        <div key={Math.random()}>
          <h1>{key}</h1>
          <div>
            {this.renderItems(this.newCaddy[key])}
          </div>
        </div>
      );
    }
    return caddy;
  }
  
  render() {
    return (
      <div className='caddy'>
        {this.renderCaddy}
      </div>
    );
  }
}

import './Caddy.scss';