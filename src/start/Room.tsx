import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Input, Textarea, nonEmpty } from '../../crankshaft/Input';
import { StuffState, Stuff } from './Stuff';



type RoomProps = {
    stuffs: StuffState[];
}

class RoomState {
    @observable stuffs: StuffState[] = [ new StuffState({}) ];
}

export const roomState = new RoomState();

/** Room input component */
@observer
export class Room extends React.Component< RoomProps, any > {
    constructor(props: RoomProps) {
        super(props);
    }

    addStuff() {
        // init required undefined stuffs values
        roomState.stuffs = roomState.stuffs.map( (stuff: StuffState) => {
            Object.keys( stuff ).map( key => {
                console.log(stuff[key]);
                if( stuff[key] === undefined && key !== 'price' ) stuff[key] = '';
            } );
            return stuff;
        } );
        roomState.stuffs.push( new StuffState({}) );
    }

    render() {
        return (
            <div className='room'>
                <h2>Welcome to your room, describe all those messy stuffs you'd like to share</h2>
                { roomState.stuffs.map( stuff => 
                    <Stuff
                        key={ Math.random() } 
                        roomState={ roomState } 
                        stuff= { stuff }
                    />
                )}
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