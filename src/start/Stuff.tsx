import * as React from 'react';
import * as classnames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Input, Textarea, nonEmpty } from '../tools/Input';
import { layoutState as layout } from '../tools/Layout';



export class StuffState {
    constructor ( { name, description, pictures, price }: StuffState ) {
        this.name = name;
        this.description = description;
        this.pictures = pictures || [];
        this.price = price;
    }
    @observable name ?: string;
    @observable description ?: string;
    @observable pictures ?: string[] = [];
    @observable price ?: number;
}

type StuffProps = {
    stuff: StuffState
    index: Number;
    roomState: any;
}

/** Stuff input component */
@observer
export class Stuff extends React.Component< StuffProps, StuffState > {

    constructor(props: StuffProps) {
        super(props);
        this.state = this.props.stuff;
    }

    @observable isValid: boolean = false;

    get priceField(): React.ReactElement< any > {
        if( this.state.price !== undefined ) {
            return <Input
                        id="stuff-price"
                        type="number"
                        label="price"
                        min={ 0 }
                        value={ this.state.price }
                        onChange={ (e: any) => this.state.price = e.currentTarget.value } 
                    />
        } else {
            return <button 
                        className="btn price"
                        onClick={ _ => this.state.price = 0 }
                    >
                        <i className="material-icons">add_circle_outline</i>Give it a Price
                    </button>
        }
    }

    get closeButton(): React.ReactElement< any > {
        if( this.props.index === 0 ) return <span/>
        return (
            <i
                className="close material-icons"
                onClick={ _ => this.props.roomState.stuffs.splice(this.props.index, 1) }
            >close
            </i>
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
                            src={picture} /> 
                    ) }
                </div>
                <span className='top-line line'/>
                <Form validityChange={ (isValid) => this.isValid = isValid } >
                    <Input
                        id="stuff-name"
                        type="text"
                        label='name'
                        constraints={ [ nonEmpty() ]}
                        value={ this.state.name }
                        onChange={ (e: any) => this.state.name = e.currentTarget.value }
                    />
                    <Textarea
                        id="stuff-description"
                        label="description"
                        constraints={ [ nonEmpty() ] }
                        rows={ 3 }
                        value={ this.state.description }
                        onChange={ (e) => this.state.description = e.currentTarget.value }
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
                </Form>
            </div>
        );
    }
}

import './Stuff.scss';