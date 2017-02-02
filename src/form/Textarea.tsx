import * as React from 'react';
import { observable, autorun, extendObservable, computed } from 'mobx';
import { observer } from 'mobx-react';

type Field = {
    value: any;
    constraints: Function[];
    isValid: boolean;
}

type TextareaProps = {
    label: string;
    field: Field;
    rows?: number;
}

@observer
export default class Textarea extends React.Component< TextareaProps, any > {

    render() {
        let { field } = this.props;
        return (
            <div className='textarea'>
                <label>{ this.props.label }</label>
                <textarea
                    rows={ this.props.rows }
                    defaultValue={ field.value }
                    onChange={ e => {
                        field.isValid = !field.constraints.find(cons => !cons(e.currentTarget.value).isValid )
                        field.value = e.currentTarget.value
                    } }
                />
                <div className='errors'>
                    { field.constraints
                        .filter( c => !!c( field.value ).error )
                        .map( c =>
                            <div key={ c(field.value).error }>{ c( field.value ).error }</div>
                            )
                        }
                </div>
            </div>
        );
    }
}

import './Form.scss';