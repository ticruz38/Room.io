import * as React from 'react';
import * as classNames from 'classnames';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';


export function nonEmpty() {
    return function test(value: string) { 
        if(value === undefined) return 'undefined';
        if(value.length === 0) {
            return 'please input a value in that field';
        }
    }
}

export function atLeast(least: number) {
    return function test(value: string) {
        if(value === undefined) return 'undefined';
        if(value.length < least) {
            return 'That field require at least '+ least + ' characters';
        }
    }
}

export function atMost(most: number) {
    return function test(value: string) {
        if(value === undefined) return 'undefined';
        if(value.length > most) {
            return 'That field cannot be more than '+ most + 'characters';
        }
    }
}

export function email() {
    return function test(value: string) { 
        if(value === undefined) return 'undefined';
        const re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
        if( !re.test(value) ) return 'That email address is invalid';
    }
}

type InputProps = {
    errorChecker?: {[prop: string]: string}
    min?: number;
    max?: number
    type?: string;
    label?: string;
    constraints?: Function[];
    id: string;
    value: any;
    onChange: (e: any) => void;
}

type InputState = {
    value: string;
}

export class Input extends React.Component< InputProps, InputState > {

    public static defaultProps: any = { constraints: [] };

    get isValid():boolean {
        return !this.props.constraints.filter((c: Function) => {
            const test = c(this.props.value);
            return test === 'undefined' ? false : test;
        }).length;
    }

    mapConstraint = (c: Function) => {
        const test = c(this.props.value)
        return test === 'undefined' ? '' : test;
    }

    render() {
        return (
            <div className="input">
                { this.props.label ? <label>{this.props.label}</label> : <span/> }
                <input
                    className={ classNames( { error: !this.isValid } ) }
                    type={this.props.type}
                    defaultValue={this.props.value}
                    onChange={this.props.onChange}
                    min={this.props.min}
                    max={this.props.max}
                />
                <div className="errors">
                    { this.props.constraints.map( this.mapConstraint ) }
                </div>
            </div>
        );
    }
}


type TextareaProps = InputProps & {
    rows?: number;
    cols?: number;
}

type TextareaState = InputState;

export class Textarea extends React.Component< TextareaProps, InputState > {

    public static defaultProps: any = { constraints: [] };

    get isValid():boolean {
        return !this.props.constraints.filter((c: Function) => {
            const test = c(this.props.value);
            return test === 'undefined' ? false : test;
        }).length;
    }

    mapConstraint = (c: Function) => {
        const test = c(this.props.value)
        return test === 'undefined' ? '' : test;
    }

    render() {
        return (
            <div className="textarea">
                { this.props.label ? <label>{this.props.label}</label> : <span/> }
                <textarea
                    className={ classNames( { error: !this.isValid } ) }
                    rows={ this.props.rows }
                    cols={ this.props.cols }
                    defaultValue={this.props.value}
                    onChange={this.props.onChange}
                />
                <div className="errors">
                    { this.props.constraints.map( this.mapConstraint ) }
                </div>
            </div>
        );
    }
}

type FormProps = {
    validityChange: (isValid: boolean)=> void;
    children?: any[]
}

export class Form extends React.Component< FormProps, any > {
    isValid: boolean = false;

    checkValidity(props: FormProps) {
        const isValid = !props.children.find( (c: any ) => {
            if(!c.props.constraints) return;
            return c.props.constraints.find( (co: any) => {
                return co(c.props.value)
            });
        });
        if( isValid !== this.isValid ) this.props.validityChange(isValid);
        this.isValid = isValid;
    }

    componentWillMount() {
        this.checkValidity(this.props);
    }

    componentWillReceiveProps(nextProps: FormProps) {
        this.checkValidity(nextProps);
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

import './Input.scss';