import * as React from 'react';
import * as classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export const nonEmpty = (value: any) => {
    if(value === undefined) return 'undefined';
    if(value.length === 0) {
        return 'please input a value in that field';
    }
}

export const atLeast = (value: any) => {
    if(value === undefined) return 'undefined';
    if(value.length !>= this.least) {
        return 'That field require at least '+ this.least + 'characters';
    }
}

export const atMost = (value: any) => {
    if(value === undefined) return 'undefined';
    if(value.length !<= this.most) {
        return 'That field cannot be more than '+ this.most + 'characters';
    }
}

export const email = (value: any) => {
    if(value === undefined) return 'undefined';
    const re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    if( !re.test(value) ) return 'That email address is invalid';
}

type InputProps = {
    id: string;
    errorChecker?: {[prop: string]: string}
    type?: string;
    label?: string;
    constraints?: Function[];
    value: string;
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
        this.props.errorChecker[this.props.id] = test;
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
        this.props.errorChecker[this.props.id] = test;
        return test === 'undefined' ? '' : test;
    }

    render() {
        return (
            <div className="textarea">
                { this.props.label ? <label>{this.props.label}</label> : <span/> }
                <textarea
                    rows={this.props.rows}
                    cols={this.props.cols}
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

import './Input.scss';