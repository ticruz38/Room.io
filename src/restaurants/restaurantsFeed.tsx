import * as React from "react";

import {computed, observable, toJS, autorun} from 'mobx'

import { observer } from 'mobx-react';

import { View } from '../../crankshaft/view';

import graphStore from '../graphStore';
import uiStore from '../uiStore';

import RestaurantSelected from './RestaurantSelected';

interface RestaurantsFeedProps {

}

export interface Meal {
  id: string;
  parent: string,
  name: string,
  description: string,
  length: number // this is used in caddy
}

export interface Food {
  id: string,
  name: string,
  description: string,
  meals: Meal[],
  picture: {
    url: string,
    size: number[]
  }
}

export interface Restaurant {
  id: string,
  reviews?: { count: number, averageScore: number },
  picture: {
    url: string,
    size: number[]
  },
  name?: string,
  description?: string,
  foods: Food[]
}


// the main component restaurantFeedState;
export class RestaurantFeedState {

  /** get next or prev sibling restaurant */
  browseRestaurant: (prop: number) => void = (prop) => {    
    this.restaurant = this.restaurants[this.restaurants.findIndex(restaurant => restaurant.id === this.restaurant.id) + prop ]
  }
  
  @observable restaurants: Restaurant[] = [];

  @observable columnWidth: number = 300;

  @observable restaurant: Restaurant; //selected restaurant

  @computed get numberOfColumn(): number {
    return Math.round(uiStore.windowSize[1] / restaurantFeedState.columnWidth);
  }
  
}

export const restaurantFeedState = new RestaurantFeedState();

@observer
export class RestaurantsFeed extends View {

  constructor(props: RestaurantsFeedProps) {
    super(props);
  }

  componentWillMount() {
    graphStore.graphRequest(this.fragments, this.variableString, this.variables).then((result: any) => {
      restaurantFeedState.restaurants = result.data.list;
    })
  }

  variables: { count: number, location: number[], filter: string[], sort: string} = {
    count: 20,
    location: [-122.5, 37.3],
    filter: [],
    sort: ''
  }

  variableString: string = `$count: Int!, $location: [Float], $filter: [String], $sort: String`;

  fragments: { [s: string]: string } = {
    restaurants: `
      fragment restaurants on  RootQueryType {
        list: restaurants(count: $count, location: $location, filter: $filter, sort: $sort) {
          id,
          name,
          description,
          distance,
          picture {
            url,
            size
          },
          reviews {
            averageScore
          }
          scorable,
          open,
          foods {
            id,
            name,
            description
            meals {
              id,
              name,
              description
            }
            picture {
              size,
              url
            }
          }
        }
      }
    `
  };

  get modal() {
    if (!restaurantFeedState.restaurant) return <span/>;
    return <RestaurantSelected restaurantFeedState = {restaurantFeedState} />
  }
  /**
   * @override View
   * 
   */
  get content(): React.ReactElement<any> {
    //set the array of restaurants array
    const columns: Restaurant[][] = [];

    const columnsComponent = (restaurants: Restaurant[], index: number) => {
      return (
        <div className='column' key={index}>
          { restaurants.map( restaurant => <Restaurant {...restaurant} key={restaurant.id} /> ) }
        </div>
      )
    }    
    //divide restaurants array in n distinct array
    for (let i = 0; i < restaurantFeedState.restaurants.length; i++) {
      let column = columns[i % restaurantFeedState.numberOfColumn];
      column ? column.push(restaurantFeedState.restaurants[i]) : columns.push([restaurantFeedState.restaurants[i]]);
    }
    return (
      <div className='restaurants-grid'>
        { columns.map(columnsComponent) }
      </div>
    )
  }
}

const Restaurant = (restaurant: Restaurant) => {
  return (
    <div className='restaurant'>
      <img src={restaurant.picture.url} onClick={_ => { restaurantFeedState.restaurant = restaurant } } />
      <i>{restaurant.reviews.count} {restaurant.reviews.averageScore}</i>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.description}</p>
    </div>
  );
};


import './restaurantsFeed.scss';


