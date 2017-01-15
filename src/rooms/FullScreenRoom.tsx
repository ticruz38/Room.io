import * as React from "react";

import {computed, observable, toJS, autorun} from 'mobx'

import * as classnames from 'classnames';

import {
  RoomFeedState, Room, Food, Meal,
} from './RoomFeed';

import Caddy from './caddy';

import { observer } from 'mobx-react';

interface props {
  roomFeedState: RoomFeedState
}

export class RoomState {

  @observable selectedFood: Food

  @observable caddy: Meal[] = [];

}

export const roomState = new RoomState();

@observer
export default class RoomSelected extends React.Component<props, any> {

  /** refresh caddy any time selected room change */
  refreshCaddy = autorun( () => {
    this.roomFeedState.room;
    roomState.caddy = [];
  })

  get roomFeedState() {
    return this.props.roomFeedState;
  }
  
  get selectedFood() {
    return roomState.selectedFood || this.roomFeedState.room.stuffs[0];
  }

  addCaddyItem = (meal: Meal) => {
    let newMeal = Object.assign({}, meal); // send a new object instance here
    roomState.caddy.push(newMeal);
  }

  render() {

    const Meal = (props: Meal) => {
      return (
        <tr className='row'>
          <td className='meal-name'>{props.name}</td>
          <td className='meal-description'>{props.description}</td>
          <td className='caddy-icon'><i onClick={ () => this.addCaddyItem( props ) } className="material-icons">add_shopping_cart</i></td>
        </tr>
      );
    } 
    
    const room = this.roomFeedState.room;
    
    return (
      <div className='full-screen'>
        <i className="material-icons" onClick={_ => this.roomFeedState.room = null}>close</i>
        <span className='arrow-left'>
          <i className="material-icons" onClick={ _ => this.roomFeedState.browseRoom(-1) }>keyboard_arrow_left</i>
        </span>
        <span className='arrow-right'>
          <i className="material-icons" onClick={ _ => this.roomFeedState.browseRoom(1) }>keyboard_arrow_right</i>
        </span>
        <div className="room-selected">
          <h1>{room.name}</h1>
          <img src={room.pictures[0]}/>
        </div>

        <div className='stuffs-bar'>
          {room.stuffs.map(food => {
            return (
              <div className={classnames('food-item', { selected: food === this.selectedFood }) }
                key={food.id}
                onClick={ () => { roomState.selectedFood = food } }>
                <strong>{food.name}</strong>
              </div>
            );
          })}
        </div>
        <table
          className='card'
          style={{ backgroundImage: `url(${this.selectedFood.picture.url} )` } } >
          <tbody>
            {this.selectedFood.meals.map(meal => {
                return <Meal {...meal} key={meal.id} parent={this.selectedFood.name} />
              })
            }
          </tbody>
        </table>
        {roomState.caddy.length ? <Caddy roomState={roomState} /> : <span/>}
      </div>
    )
  }
}


import './FullScreenRoom.scss';
