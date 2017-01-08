import * as React from 'react';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { execute } from 'graphql';

import db from '../IpfsApiStore';
import Loader from '../graphql-client/Loader';

import { Form, Input, Textarea, nonEmpty } from '../tools/Input';
import { layoutState as layout } from '../tools/Layout';

import { StuffState, Stuff } from './Stuff';

const RoomQuery = require('./Room.gql');

type RoomProps = {
}

class RoomState extends Loader {
    @observable stuffs: React.ReactElement<any>[] = [ 
        /*<Stuff
            key={ Math.random() }
            roomState={ roomState }
            stuff={ new StuffState({}) }
            index={ 0 }
        />*/
    ];
}

const roomState = new RoomState({query: RoomQuery});

/** Room input component */
@observer
export class Room extends React.Component< RoomProps, any > {
    constructor(props: RoomProps) {
        super(props);
    }

    componentWillMount() {
        layout.title = 'Fill the Room';
        layout.toolBar = (
                <button
                    onClick={ _ => console.log('saveroom') }
                >Save</button>
        );
    }

    addStuff() {
        // init required undefined stuffs values
        roomState.stuffs = roomState.stuffs.map( (stuff: React.ReactElement< any >) => {
            Object.keys( stuff.props.stuff ).map( key => {
                if( stuff.props.stuff[key] === undefined && key !== 'price' ) stuff.props.stuff[key] = '';
            } );
            return stuff;
        } );
        roomState.stuffs.push(
            <Stuff
                key={ Math.random() }
                roomState={ roomState }
                stuff={ new StuffState({}) }
                index={ roomState.stuffs.length }
            />
         );
    }

    render() {
        return (
            <div className='room'>
                <h2>Welcome to your room, describe all those messy stuffs you'd like to share</h2>
                { roomState.stuffs }
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

import './Room.scss';