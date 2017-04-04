import * as React from 'react';
import * as classnames from 'classnames';
import { observable, autorun, extendObservable, computed } from 'mobx';
import { observer } from 'mobx-react';

type InputProps = {
    label?: string;
    field: Field;
    type: string;
    min?: number;
    max?: number; 
    placeholder?: string;
}

@observer
export default class Input extends React.Component< InputProps, any > {

    i: number = -1;
    initialValue: any;
    componentWillMount() {
        this.initialValue = this.props.field.value;
    }

    get isValid(): boolean {
        const {field} = this.props
        return !field.constraints.find(constraint => !constraint(field.value).isValid)
    }

    get errors(): React.ReactElement< any > {
        this.i++;
        if(this.i === 0) return <div className="errors"/>;
        const { field } = this.props;
        return (
            <div className='errors'>
                { field.constraints
                    .filter( c => !!c(field.value).error )
                    .map( c => <div key={ c(field.value).error}>{ c(field.value).error }</div> )
                }
            </div>
        );
    }

    get placeholder(): React.ReactElement< any > {
        const classname = !!this.props.field.value || this.props.type === "number" ? 'label' : '';
        return (
            <div className={ "placeholder " + classname }>{this.props.placeholder}</div>
        );
    }

    render() {
        let { field } = this.props;
        return (
            <div className='input'>
                {/*{ this.props.label ? <label>{this.props.label}</label> : null}*/}
                { this.placeholder }
                <input
                    className={classnames({error: !this.isValid})}
                    type={ this.props.type }
                    value={ field.value }
                    onChange={ e => {
                        field.isValid = !field.constraints.some(constraint => !constraint(e.currentTarget.value).isValid )
                        field.hasChanged = e.currentTarget.value !== this.initialValue;
                        field.value = e.currentTarget.value
                    } }
                    min={ this.props.min }
                    max={ this.props.max }
                />
                { this.errors }
            </div>
        );
    }
}

import './Form.scss';