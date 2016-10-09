import * as React                                   from "react";
import {computed, observable, toJS, autorun}        from 'mobx';
import { observer }                                 from 'mobx-react';
import * as classnames                              from 'classnames';

import { Restaurant, Food, Meal } from './restaurantsFeed';


@observer
export default class Caddy extends React.Component<any, any> {
  
  @observable newCaddy: Meal[][] = [];
  /**
   * sort the caddy so that duplicate item are groupped in separate array
   */
  sortCaddy() {
    this.newCaddy = [];
    let caddy = [...this.props.caddy]
    let i = 0;
    const sortCaddy = () => {
      console.log(caddy);
      caddy = caddy.filter((item) => {
        if (caddy[0].id === item.id) {
          this.newCaddy[i] ? this.newCaddy[i].push(item) : this.newCaddy[i] = [item]
        };
        return caddy[0].id !== item.id;
      });
      console.log(caddy);
      i++;
      if (caddy.length) sortCaddy();
    }
    sortCaddy();
  }

  componentWillMount() {
    this.sortCaddy();
  }

  componentWillReceiveProps() {
    this.sortCaddy();
  }



  get renderCaddy() {
    return this.newCaddy.map(item => {
      return (
        <div className='caddy-item' key={ item[0].id }>
            <div>{item.length > 1 ? item.length + 'X' : ''}<i className="material-icons">close</i></div>
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