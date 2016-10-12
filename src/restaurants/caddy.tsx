import * as React                                   from "react";
import {computed, observable, toJS, autorun }        from 'mobx';
import { observer }                                 from 'mobx-react';
import * as classnames                              from 'classnames';

import { Restaurant, Food, Meal } from './restaurantsFeed';

//import { foodState } from './restaurantSelected';


@observer
export default class Caddy extends React.Component<any, any> {
  
  /**
   * sort the caddy so that duplicate item are groupped in separate array
   * TODO this should be get with a computed
   */ 
  @computed get newCaddy() {
    const newCaddy: Meal[][] = [];
    let caddy = [...this.props.foodState.caddy]
    let i = 0;
    const sortCaddy = () => {
      caddy = caddy.filter((item) => {
        if (caddy[0].id === item.id) {
          newCaddy[i] ? newCaddy[i].push(item) : newCaddy[i] = [item]
        };
        return caddy[0].id !== item.id;
      });
      i++;
      if (caddy.length) sortCaddy();
    }
    sortCaddy();
    return newCaddy;
  }

  removeItem(id: string) {
    const foodState = this.props.foodState;
    foodState.caddy.splice( foodState.caddy.findIndex((item: Meal) => item.id === id), 1 );
  }


  get renderCaddy() {
    return this.newCaddy.map(item => {
      return (
        <div className='caddy-item' key={ item[0].id }>
          <div>
            <span>{item.length > 1 ? item.length + 'X' : ''}</span>
            <i onClick={_ => this.removeItem(item[0].id)} className="material-icons">close</i>
          </div>
            <strong>{item[0].name}</strong>
          </div>
      );
    })
  }
  
  render() {
    return (
      <div className='caddy'>
        {this.renderCaddy}
      </div>
    );
  }
}

import './caddy.scss';