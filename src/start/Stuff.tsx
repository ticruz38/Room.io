import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Input, Textarea, nonEmpty } from '../tools/Input';



export class StuffState {
    constructor ( { name, description, fileUrl, price }: StuffState ) {
        this.name = name;
        this.description = description;
        this.fileUrl = fileUrl;
        this.price = price;
    }
    @observable name ?: string;
    @observable description ?: string;
    @observable fileUrl ?: string;
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

    loadImageUrl(e) {
        const reader = new FileReader();
        reader.readAsDataURL(e.dataTransfer.files[0]);
        reader.onloadend = (e: any) => {
            this.state.fileUrl = e.target.result;
        }
    }

    render() {
        return (
            <div className="stuff">
                { this.closeButton }
                <div className='image-layer' style={ { backgroundImage: `url( ${this.state.fileUrl} )`  } }/>
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
                    <input 
                        className='image-upload'
                        onChange={ this.loadImageUrl }
                        type='file' 
                    />
                    <p><a>Click here</a> to add an image</p>
                    <span className='bottom-line line'/>
                </Form>
            </div>
        );
    }
}

import './Stuff.scss';