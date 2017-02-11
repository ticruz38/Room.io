import * as React from 'react';
import * as guid from 'node-uuid';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';

import Loader from 'graph/Loader';
import { layoutState as layout } from 'routes/layout/Layout';
import Stuff, { StuffState } from 'routes/start/stuffs/Stuff';


const StuffsDocument = require('./Stuffs.gql');

type RoomProps = {
}

class StuffsState extends Loader {
    _id: string = guid.v1();
    name: string;
    description: string;

    addStuff(stuff) {
        this.execute('AddStuff', stuff.format);
    }

    format(): Object {
        return {
            _id: this._id,
            name: this.name,
            description: this.description,
        }
    }
    @observable stuffs: StuffState[] = [new StuffState(this._id)];
}

const stuffsState = new StuffsState( StuffsDocument );

/** Room input component */
@observer
export default class Stuffs extends React.Component< RoomProps, any > {
    constructor(props: RoomProps) {
        super(props);
    }

    componentWillMount() {
        layout.title = 'Add Some Stuffs';
        layout.backRoute = 'room';
        layout.toolBar = <button onClick={ _ => console.log('saveroom') } >Save</button>;
    }

    addStuff() {
        // init required undefined stuffs values
        stuffsState.stuffs.push( new StuffState( stuffsState._id ) );
        debugger;
    }

    render() {
        return (
            <div className='room'>
                <h2>Welcome to your room, describe all those messy stuffs you'd like to share</h2>
                { stuffsState.stuffs.map( (stuff, index) =>
                    <Stuff
                        key={ stuff._id }
                        stuff={stuff}
                        index={index}
                        stuffsState={stuffsState}
                    />
                ) }
                <button
                    className="btn add-stuff"
                    onClick={ _ => this.addStuff() }
                >
                <i className="material-icons">add_circle_outline</i>Add some stuffs
                </button>
            </div>
        );
    }
}

import '../room/Room.scss';