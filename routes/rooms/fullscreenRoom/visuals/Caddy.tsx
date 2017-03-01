import * as React from "react";
import { computed, observable, toJS, autorun  } from 'mobx';
import { observer } from 'mobx-react';
import * as classnames from 'classnames';


@observer
export default class Caddy extends React.Component<any, any> {

  get roomState() {
    return this.props.roomState
  }


  removeItem(id: string) {
    this.roomState.caddy.splice(this.roomState.caddy.findIndex((item: Stuff) => item._id === id), 1);
  }


  renderStuffs() {
    const { room, caddy, amount } = this.roomState;
      return Object.keys(this.roomState.caddyByCategories).map(key => (
          <div className="caddy-category">
            <h4>{key}</h4>
            <div key={key} className='caddy-stuffs'>
            { this.roomState.caddyByCategories[key].map((s, i) => (
                <div key={i} className="caddy-stuff">
                  <i className="material-icons close" onClick={ _ => this.removeItem(s._id) }>close</i>
                  <strong>{s.name}</strong>
                </div>
              ) ) }
            </div>
          </div>
      ) );
  }

  render() {
    return (
      <div className="caddy-container">
        <div className="caddy-line"><i className="shopping material-icons">shopping_cart</i></div>
        <div className="caddy">
          <div className='caddy-flex'>
            { this.renderStuffs() }
          </div>
        </div>
      </div>
    );
  }
}

import './Caddy.scss';