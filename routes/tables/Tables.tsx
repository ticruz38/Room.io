import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

import { SpinnerIcon } from 'components/icons';

import db from 'graph/IpfsApiStore';


class TableState {
    @mobx.observable loading: boolean;
    @mobx.observable tables: { table: Object, dbName: string }[] = [];
}

const state = new TableState();

@observer
export default class Tables extends React.Component<any, any> {

    createTable(table, dbName) {
        state.tables.push({ table, dbName });
    }

    componentWillMount() {
        console.log('tableswillmount');
        Promise.all([
            db.room.then(r => this.createTable(r, 'room')),
            db.user.then(r => this.createTable(r, 'user')),
            db.stuff.then(r => this.createTable(r, 'stuff')),
            db.order.then(r => this.createTable(r, 'order'))
        ]).then(_ => state.loading = false);
    }

    render() {
        return (
            <div>
                {state.tables.map(table => <Table {...table} />)}
            </div>
        )
    }
}

@observer
class Table extends React.Component<any, any> {

    @mobx.observable request: string;
    @mobx.observable results: Object[] = this.props.table.query(t => !!t);

    triggerRequest() {
        const request = JSON.parse(this.request);
    }

    displayResults(result: Object) {
        return (
            <tr onClick={_ => this.props.table.del(result['_id'])}>
                {Object.keys(result).map(k => <td>{result[k]}</td>)}
            </tr>
        );
    }

    get renderContent() {
        if (!this.results.length) return <span />
        return (
            <table>
                <thead>
                    <tr>
                        {Object.keys(this.results[0]).map(result => <td>{result}</td>)}
                    </tr>
                </thead>
                <tbody>
                    {this.results.map(result => this.displayResults(result))}
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <div className='table'>
                {this.props.dbName}
                <input
                    type='search'
                    onChange={e => this.request = e.currentTarget['result']}
                    onInput={_ => this.triggerRequest()}
                />
                {this.renderContent}
            </div>
        );
    }
}


import './Tables.scss'