import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as classnames from 'classnames';

//components
import { Input } from 'components/form';

//dashboard
import { dashboardState as state } from '../Dashboard';

moment.locale('fr');
const secondPerDay = 24*60*60;

const Order = (order: Order) => {
  const price = order.amount * 10; // * 10 to get higher height
  return (
    <rect
      x={(order.created - secondPerDay) / 10000}
      y={order.payed ? 400 - price : 400}
      height={price} width={20}
      fill={order.payed ? 'green' : 'gainsboro'}
    />
  );
}

@observer
export default class Timeline extends React.Component<any, any> {
  @mobx.observable width: number;

  onClick = (event) => {
    var margin = 8;
    const x = (event.clientX / this.width) * 8640;
    state.currentTime = state.today + (x * 10);
    state.x = x;
  };

  render() {
    const time = (moment().unix() - state.today) / 10;
    return (
      <div className='timeline' ref = {(item) => { this.width = item ? item.clientWidth : time}}> 
        <svg id='timeline' className='command' viewBox="0 0 8640 800" onWheel={state.onWheel} onClick={this.onClick}>
          <rect x='0' y='0' width={time < 0 ? 0 : time} height='800' fill='rgba(0, 0, 0, 0.8)' />
          <rect x={time} y='0' width={8640 - time < 0 ? 0 : 8640 - time} height='800' fill='rgba(255, 255, 255, 0.8)' />
          <path d='M0,400 H8640' stroke='black' strokeWidth='1' />
          <rect className='cursor' x={state.x} y='0' width='20' height='800' fill='yellow' />
          { state.orders.map(Order) }
          <text 
            textAnchor='middle' 
            x='4320' 
            y='300' 
            fill='rgba(255, 255, 255, 0.8)' 
            stroke='black' strokeWidth='3' 
            fontSize='200'
          >
            { moment.unix(state.currentTime).format('L') }
          </text>
          <text 
            textAnchor='middle' 
            x='4320' 
            y='700' 
            fill='rgba(255, 255, 255, 0.8)' 
            stroke='black' 
            strokeWidth='3' 
            fontSize='200'
          >
            { moment.unix(state.currentTime).format('LT') }
          </text>
        </svg>
        <nav className='nav-list'>
          <ul className='cursor-container'>
            <li>
              <span id='payed'
                className={classnames('cursor-wrapper', { red: !state.filterBy.payed, green: state.filterBy.payed })} 
                onClick={ _ => state.filterBy.payed = !state.filterBy.payed}
              >payed 
                <input type="checkbox" checked={state.filterBy.payed} />
              </span>
            </li>
            <li>
              <span id='treated' 
                className={classnames('cursor-wrapper', { red: !state.filterBy.treated, green: state.filterBy.treated })} 
                onClick={ _ => state.filterBy.treated = !state.filterBy.treated}
              >treated
                <input type="checkbox" checked={state.filterBy.treated} />
              </span>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}