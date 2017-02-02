import * as React from 'react';
import * as classnames from 'classnames';
import { observable, autorun, extendObservable, computed } from 'mobx';
import { observer } from 'mobx-react';

export type Field = {
    value: any;
    constraints: Function[];
    isValid: boolean;
}

type InputProps = {
    label: string;
    field: Field;
    type: string;
    min?: number;
    max?: number; 
}

@observer
export default class Input extends React.Component< InputProps, any > {

    get isValid(): boolean {
        const {field} = this.props
        if( field.value === undefined ) return true;
        return !field.constraints.find(constraint => !constraint(field.value).isValid)
    }

    render() {
        let { field } = this.props;
        return (
            <div className='input'>
                <label>{this.props.label}</label>
                <input
                    className={classnames({error: !this.isValid})}
                    type={ this.props.type } 
                    defaultValue={ field.value }
                    onChange={ e => {
                        field.isValid = !field.constraints.find(constraint => !constraint(e.currentTarget.value).isValid )
                        field.value = e.currentTarget.value
                    } }
                    min={ this.props.min }
                    max={ this.props.max }
                />
                <div className='errors'>
                    { field.constraints
                        .filter( c => !!c(field.value).error )
                        .map( c => <div key={ c(field.value).error}>{ c(field.value).error }</div> )
                    }
                </div>
            </div>
        );
    }
}

import './Form.scss';