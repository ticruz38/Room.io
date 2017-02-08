import * as React from 'react';
import * as classnames from 'classnames';
import * as guid from 'node-uuid';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import Loader from 'graphql-client/Loader';
import { nonEmpty } from 'form/Constraint';
import Form from 'form/Form';
import Input from 'form/Input';
import { layoutState as layout } from 'layout/Layout';



export class StuffState {
    _id: string;
    roomId: string;
    @observable name ?: string;
    @observable description ?: string;
    @observable pictures ?: string[] = [];
    @observable price ?: number;

    constructor ( roomId: string ) {
        this._id = guid.v1();
        this.roomId = roomId
    }

    format(): Object {
        return {
            roomId: this.roomId,
            name: this.name,
            description: this.description,
            pictures: this.pictures,
            price: this.price
        }
    }
}

type StuffProps = {
    stuff: StuffState
    index: Number;
    stuffsState: any;
}

/** Stuff input component */
@observer
export default class Stuff extends React.Component< StuffProps, StuffState > {

    constructor(props: StuffProps) {
        super(props);
        this.state = this.props.stuff;
    }

    @observable isValid: boolean = false;

    get priceField(): React.ReactElement< any > {
        if( this.state.price !== undefined ) {
            return (
                <input
                    label="price"
                    type="number"
                    min={ 0 }
                    value={ this.state.price }
                    onChange={ e => this.state.price = JSON.parse(e.currentTarget.value) } 
                />
            )
        } else {
            return (
                <button
                    className="btn price"
                    onClick={ _ => this.state.price = 0 }
                >
                    <i className="material-icons">add_circle_outline</i>Give it a Price
                </button>
            );
        }
    }

    get closeButton(): React.ReactElement< any > {
        if( this.props.index === 0 ) return <span/>
        return (
            <i
                className="close material-icons"
                onClick={ _ => this.props.stuffsState.stuffs.splice(this.props.index, 1) }
            >close</i>
        );
    }

    loadImageUrl = (e) => {
        const reader = new FileReader();
        const upload:any = this.refs['upload'];
        reader.readAsDataURL(upload.files[0]);
        reader.onloadend = (e: any) => {
            this.state.pictures.push(e.target.result);
        }
    }

    _onDrop = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.readAsDataURL(e.dataTransfer.files[0]);
        reader.onloadend = (e: any) => {
          this.state.pictures.push(e.target.result);
        }
    }

    render() {
        return (
            <div className="stuff" onDrop={this._onDrop} onDragOver={e => e.preventDefault()}>
                { this.closeButton }
                <div className={classnames('image-layer', { hidden: !this.state.pictures.length } ) }>
                    { this.state.pictures.map( picture =>
                        <img
                            key={ Math.random() }
                            className="stuff-picture"
                            onClick={ _ => layout.modal = (
                                <img src={picture} style={{ maxHeight: '100%', maxWidth:'100%'}} />
                            ) }
                            src={picture} 
                        /> 
                    ) }
                </div>
                <span className='top-line line'/>
                <Form ref='form'
                    validityChange={ isValid => this.isValid = isValid }
                    fields={ [
                        {
                            element: 'input',
                            type: 'text',
                            label: 'name',
                            value: this.state.name,
                            constraints:[ nonEmpty() ]
                        }, {
                            element: 'textarea',
                            label:"description",
                            value: this.state.description,
                            constraints: [ nonEmpty() ],
                            rows: 3,
                        }
                    ] }
                />
                    { this.priceField }
                    <div className='upload'>
                        <input
                            ref='upload'
                            className='image-upload'
                            onChange={ this.loadImageUrl }
                            type='file' 
                        />
                        <p><a>Click here</a> or <strong>drop in</strong> to add a picture</p>
                    </div>
                    <span className='bottom-line line'/>
            </div>
        );
    }
}

import './Stuff.scss';