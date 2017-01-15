import * as React from 'react';
import * as classnames from 'classnames';
import { Link } from 'react-router';

import { observable, autorun, extendObservable, computed } from 'mobx';
import { observer } from 'mobx-react';

import { nonEmpty, email, atLeast, atMost, Input, Textarea, Form } from '../tools/Input';
import { layoutState as layout } from '../tools/Layout';
import Loader from '../graphql-client/Loader';
//import ipfs from '../IpfsStore';
import db from '../IpfsApiStore';

const RoomDocument = require('./Room.gql');
const Guid = require('guid');


export class RoomState extends Loader {
    _id: string = Guid.raw();
    @observable name: string;
    @observable description: string;
    @observable email: string;
    @observable phoneNumber: string;
    @observable pictures: string[];
    @observable nodeError: string;

    format() {
        return {
            room : {
                _id: this._id,
                name: this.name,
                description: this.description,
                email: this.email,
                phoneNumber: this.phoneNumber,
                pictures: this.pictures
            }
        }
    }
}

export const roomState = new RoomState( RoomDocument );

@observer
export class RoomView extends React.Component< any, {isValid: boolean} > {

    @observable isValid: boolean = false;

    uploadDataToIPFS() {
        if( !this.isValid ) return this.initForm();
    }

    componentWillMount() {
        layout.title = 'Set your room up';
        // observe isValid and set up the toolbar relatively
        autorun( _ => {
            if( this.isValid ) {
                layout.toolBar = (
                    <Link 
                        className="button"
                        to="/room"
                        onClick={ _ => roomState.execute( 'AddRoom', roomState.format() ) }
                    >Add some stuffs
                    </Link>
                );
            } else {
                layout.toolBar = null;
            }
        } );
    }

    /** this method is used to init required form values */
    initForm() {
        Object.keys( roomState ).map( key => {
            if(roomState[key] === undefined) roomState[key] = '';
        } )
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
                <Form validityChange={ isValid => this.isValid = isValid } >
                    <Input
                        id="name"
                        type="text"
                        label="Business Name"
                        value={roomState.name}
                        onChange={ (e: any) => roomState.name = e.currentTarget.value }
                        constraints={ [ nonEmpty() ]}
                    />
                    <Textarea
                        id="description"
                        label="Put a brief description on what your business offer"
                        value={ roomState.description }
                        onChange={ (e: any) => roomState.description = e.currentTarget.value }
                        constraints={ [ atLeast(10), atMost(200) ]} 
                    />
                    <Input
                        id="email"
                        label="Email Address"
                        type='email'
                        value={roomState.email}
                        onChange={ (e:any) => roomState.email = e.currentTarget.value }
                        constraints={ [ email() ] }
                    />
                    <Input
                        id="phone number"
                        label="Phone Number"
                        type="tel"
                        value={roomState.phoneNumber}
                        onChange={ (e: any) => roomState.phoneNumber = e.currentTarget.value }
                    />
                </Form>
            </div>
        );
    }
}

import './Room.scss';