import * as React from "react";

import {computed, observable, toJS, autorun} from 'mobx'

import * as classnames from 'classnames';

import { feedState, Restaurant, Food, Meal } from './restaurantsFeed';

import Caddy                  from './caddy';

import { observer } from 'mobx-react';

interface props {
  restaurant: Restaurant
}

class FoodState {
  @observable selectedFood: Food
  @observable caddy: Meal[] = [];
}

export const foodState = new FoodState();

@observer
export default class RestaurantSelected extends React.Component<props, any> {

  componentWillMount() {    
    foodState.selectedFood = this.props.restaurant.foods[0];
  }

  componentWillReceiveProps(nextProps: props) {
    foodState.caddy = [];
    foodState.selectedFood = nextProps.restaurant.foods[0]
  }

  get selectedFood() {
    return foodState.selectedFood;
  }

  addCaddyItem = (meal: Meal, parent: string) => {    
    foodState.caddy.push(Object.assign({}, meal, {parent: parent} ) )
  }

  render() {

    const Meal = (meal: Meal, parent: string) => {
      return (
        <tr className='row'>
          <td className='meal-name'>{meal.name}</td>
          <td className='meal-description'>{meal.description}</td>
          <td className='caddy-icon'><i onClick={ () => this.addCaddyItem( meal, parent ) } className="material-icons">add_shopping_cart</i></td>
        </tr>
      );
    } 
    
    const {restaurant} = this.props;
    
    return (
      <div className='full-screen'>
        <i className="material-icons" onClick={_ => feedState.selectedIndex = null}>close</i>
        <span className='arrow-left'>
          <i className="material-icons" onClick={ _ => feedState.selectedIndex -= 1 }>keyboard_arrow_left</i>
        </span>
        <span className='arrow-right'>
          <i className="material-icons" onClick={ _ => feedState.selectedIndex += 1 }>keyboard_arrow_right</i>
        </span>
        <div className="restaurant-selected">
          <h1>{restaurant.name}</h1>
          <img src={restaurant.picture.url}/>
        </div>

        <div className='foods-bar'>
          {restaurant.foods.map(food => {
            return (
              <div className={classnames('food-item', { selected: food === this.selectedFood }) }
                key={food.id}
                onClick={ () => { foodState.selectedFood = food } }>
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
        {foodState.caddy.length ? <Caddy foodState={foodState} /> : <span/>}
      </div>
    )
  }
}


import './restaurantSelected.scss';
