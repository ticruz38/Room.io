import * as React from 'react';
import * as classnames from 'classnames';
import * as guid from 'node-uuid';
import { Link } from 'react-router';

import { observable, autorun, extendObservable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { nonEmpty, email, atLeast, atMost } from 'components/form/Constraint';
import { Textarea, Input } from 'components/form';
import { layoutState as layout } from 'routes/layout/Layout';
import Loader from 'graph/Loader';

const RoomDocument = require('./Room.gql');


export class RoomState extends Loader {
    _id: string = guid.v1();

    userId: string = layout.user["_id"]

    @observable name: Field = {
        value: undefined,
        constraints: [ nonEmpty() ],
        isValid: false
    };
    @observable description: Field = {
        value: undefined,
        constraints: [ nonEmpty() ],
        isValid: false
    };
    @observable email: Field = {
        value: undefined,
        constraints: [ nonEmpty() ],
        isValid: false
    };
    @observable phoneNumber: Field = {
        value: undefined,
        constraints: [ nonEmpty() ],
        isValid: false
    };
    @observable picture: string;
    @observable nodeError: string;

    format() {
        return {
            room : {
                _id: this._id,
                userId: this.userId,
                name: this.name.value,
                description: this.description.value,
                email: this.email.value,
                phoneNumber: this.phoneNumber.value,
                picture: this.picture
            }
        }
    }
}

export const roomState = new RoomState( RoomDocument );

@observer
export default class RoomView extends React.Component< any, {isValid: boolean} > {

    @computed get isValid() {
        return roomState.name.isValid &&
        roomState.description.isValid &&
        roomState.email.isValid &&
        roomState.phoneNumber.isValid;
    }

    componentWillMount() {
        layout.title = 'Set your room up';
        // observe isValid and set up the toolbar relatively
        autorun( _ => {
            if( this.isValid ) {
                layout.toolBar = (
                    <Link
                        className="button"
                        to="/start/stuffs"
                        onClick={ _ => {
                          console.log(roomState.format());
                          roomState.execute( 'AddRoom', roomState.format() )
                        } }
                    >Add some stuffs
                    </Link>
                );
            } else {
                layout.toolBar = null;
            }
        } );
    }

    onDrop(e: any): void {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.dataTransfer.files[0]);
        fileReader.onloadend = (e: any) => {
            console.log(e);
        }
    }


    render() {
        return (
            <div className="room" onDrop={ e => this.onDrop(e)} onDragOver={e => e.preventDefault()}>
                <div className="intro-layer"/>
                <form>
                    <Input
                        type='text'
                        field={roomState.name}
                        label='Room Name'
                    />
                    <Textarea
                        field={ roomState.description}
                        label='Tell something about your room'
                        rows={3}
                    />
                    <Input
                        type='email'
                        field={ roomState.email }
                        label='Email Address'
                    />
                    <Input
                        type='tel'
                        field={ roomState.phoneNumber }
                        label='Phone Number'
                    />
                </form>
            </div>
        );
    }
}

import './Room.scss';