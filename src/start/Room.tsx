import * as React from 'react';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import db from '../IpfsApiStore';
import { Form, Input, Textarea, nonEmpty } from '../tools/Input';
import { layoutState as layout } from '../tools/Layout';
import { StuffState, Stuff } from './Stuff';



type RoomProps = {
}

class RoomState {
    @observable stuffs: React.ReactElement<any>[] = [ 
        <Stuff
            key={ Math.random() }
            roomState={ roomState }
            stuff={ new StuffState({}) }
            index={ 0 }
        />
    ];
}

export const roomState = new RoomState();

/** Room input component */
@observer
export class Room extends React.Component< RoomProps, any > {
    constructor(props: RoomProps) {
        super(props);
    }

    componentWillMount() {
        layout.title = 'Fill the Room'
        layout.toolBar = (
                <button
                    onClick={ _ => this.saveRoom() }
                >Save</button>
        );
    }

    saveRoom() {
        roomState.stuffs.map( (stuff, index) => {
            const dbStuff = Object.assign({}, stuff.props.stuff, { roomID: db.nodeID, _id: index });
            db.stuffs.put(dbStuff).then((hash) => console.log(hash));
        } );
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