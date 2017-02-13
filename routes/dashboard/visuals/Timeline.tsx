import * as React from 'react';
import * as mobx from 'mobx';
import * as moment from 'moment';
import * as classnames from 'classnames';
import { observer } from 'mobx-react';
import { Input } from 'components/form';

moment.locale('fr');
// date value in milliseconds (unix) sonce 1970
const today = moment().startOf('day').unix();
const secondDay = 24*60*60;

class TimelineState {
  @mobx.observable filterBy: { payed: boolean, treated: boolean } = {
    payed: false,
    treated: false
  }
  @mobx.observable orders: Order[] = [];
  @mobx.observable current: number = moment().unix();
  @mobx.observable today: number = moment().startOf('day').unix();
}

const timelineState = new TimelineState()

const Order = (order: Order) => {
  const price = order.amount * 10; // * 10 to get higher height
  return (
    <rect
      x={(order.created - secondDay) / 10000}
      y={order.payed ? 400 - price : 400}
      height={price} width={20}
      fill={order.payed ? 'green' : 'gainsboro'}
    />
  );
}

@observer
export default class Timeline extends React.Component<any, any> {
  @mobx.observable state = {
    x: 0
  };
  @mobx.observable width: number;

  constructor( props: any ) {
    super(props);
    this.state.x = (timelineState.current - today) / 10;
  }
  
  timeLineWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      // timeLineDate.setTime(midnightTime + (this.state.x * 10000));

      // we scrolled back to the previous day
      if (this.state.x <= 0 && (event.deltaX < 0 || event.deltaY < 0)) {
        //timelineState.current -= secondDay;
        timelineState.today -= secondDay;
        this.state.x = 8640;
      }
      // we scrolled forth to the next day
      if (this.state.x >= 8640 && (event.deltaX > 0 || event.deltaY > 0)) {
        //timelineState.current += secondDay;
        timelineState.today += secondDay;
        this.state.x = 0;
      }
      this.state.x += event.currentTarget.id === 'timeline' ? event.deltaX : event.deltaY;
      timelineState.current = timelineState.today + (this.state.x * 10);
  }

  onClick = (event) => {
    var margin = 8;
    const x = (event.clientX / this.width) * 8640;
    timelineState.current = today + (x * 10);
    this.state.x = x;
    console.log(x, event.clientX, moment.unix(today + (x * 10000)).format());
  };

  render() {
    const time = (moment().unix() - today) / 10;
    return (
      <div className='timeline' ref = {(item) => { this.width = item ? item.clientWidth : time}}> 
        <svg id='timeline' className='command' viewBox="0 0 8640 800" onWheel={this.timeLineWheel} onClick={this.onClick}>
          <rect x='0' y='0' width={time < 0 ? 0 : time} height='800' fill='rgba(0, 0, 0, 0.8)' />
          <rect x={time} y='0' width={8640 - time < 0 ? 0 : 8640 - time} height='800' fill='rgba(255, 255, 255, 0.8)' />
          <path d='M0,400 H8640' stroke='black' strokeWidth='1' />
          <rect className='cursor' x={this.state.x} y='0' width='20' height='800' fill='yellow' />
          { timelineState.orders.map(Order) }
          <text 
            textAnchor='middle' 
            x='4320' 
            y='300' 
            fill='rgba(255, 255, 255, 0.8)' 
            stroke='black' strokeWidth='3' 
            fontSize='200'
          >
            { moment.unix(timelineState.current).format('L') }
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
            { moment.unix(timelineState.current).format('LT') }
          </text>
        </svg>
        <nav className='nav-list'>
          <ul className='cursor-container'>
            <li>
              <span id='payed'
                className={classnames('cursor-wrapper', { red: !timelineState.filterBy.payed, green: timelineState.filterBy.payed })} 
                onClick={ _ => timelineState.filterBy.payed = !timelineState.filterBy.payed}
              >payed 
                <input type="checkbox" checked={timelineState.filterBy.payed} />
              </span>
            </li>
            <li>
              <span id='treated' 
                className={classnames('cursor-wrapper', { red: !timelineState.filterBy.treated, green: timelineState.filterBy.treated })} 
                onClick={ _ => timelineState.filterBy.treated = !timelineState.filterBy.treated}
              >treated
                <input type="checkbox" checked={timelineState.filterBy.treated} />
              </span>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}