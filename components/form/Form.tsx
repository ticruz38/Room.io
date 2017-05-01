import * as React from 'react';

import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';


type Field = {
    element: string;
    type?: string;
    label: string;
    value: string;
    constraints: Function[]
    rows?: number
}

type FormProps = {
    validityChange: (isValid: boolean) => void;
    fields: Field[];
}

@observer
export default class Form extends React.Component< FormProps, any > {

    init = () => {
        this.props.fields.filter( f => f.value === undefined).map(f => f.value = '')
    }

    componentWillReceiveProps(newProps) {
        console.log('receiveProps');
        if( this.isInvalid( newProps ) !== this.isInvalid(this.props) ) newProps.validityChange( !this.isInvalid(newProps) );
    }

    isFieldInvalid(field: Field): boolean {
        if(!field.constraints) return false;
        return !!field.constraints.find( c => !!c(field.value))
    }

    isInvalid(props): boolean {
        return !!props.fields.find( f => this.isFieldInvalid(f) )
    }

    render() {
        const field = this.props.fields[0];
        return (
            <div className='form'>
                { this.props.fields.map( f => 
                    <div key={ f.label }>
                        <label>{f.label}</label>
                        <f.element
                            onChange={ e => {f.value = e.currentTarget.value; this.setState({})} }
                            value={f.value}
                            type={f.type}
                        />
                        <div className="errors">
                            { f.constraints.filter( c => c( f.value ) ).map( c => <div key={c(f.value)}>{ c( f.value ) }</div>) }
                        </div>
                    </div>
                ) }
                { this.props.children }
            </div>
        );
    }
}

import './Form.scss';