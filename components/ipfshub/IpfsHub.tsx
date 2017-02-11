import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

import db from 'graph/IpfsApiStore';


class IpfsHubState {
  @mobx.observable loading: boolean;
  @mobx.observable tables: Object[] = [];
}

const state = new IpfsHubState();

@observer
export default class IpfsHub extends React.Component< any, any > {

  createTable(table) {
    state.tables.push( table );
  }

  componentWillMount() {
    Promise.all([
      db.room.then( r => this.createTable(r) ),
      db.user.then( r => this.createTable(r) ),
      db.stuff.then( r => this.createTable(r) )
    ])
  }
  render() {
    return (
      <div>
        { state.tables.map( table => <Table {...table} /> ) }
      </div>
    )
  }
}

@observer
class Table extends React.Component< any, any > { 

  @mobx.observable request: string;
  @mobx.observable results: Object[];

  triggerRequest() {
    const request = JSON.parse(this.request);
    console.log(request);
  }

  displayResults(result: Object): React.ReactElement<any> {
    return (
      <tr>
        { Object.keys(result).map( k => <td>{ result[k] }</td> ) }
      </tr>
    );
  }

  render() {
    return (
      <div>
        <input
          type='search'
          onChange={ e => this.request = e.currentTarget['result'] }
          onInput={ _ => this.triggerRequest() }
        />
        <table>
          <thead>
            <tr>
              { Object.keys(this.results[0]).map( result => <td>{result}</td> ) }
            </tr>
          </thead>
          <tbody>
            { this.results.map( result => this.displayResults(result) ) }
          </tbody>
        </table>
      </div>
    );
  }
}


import 'IpfsHub.scss'