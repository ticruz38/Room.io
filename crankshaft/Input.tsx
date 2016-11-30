import * as React from 'react';
import * as classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

class Constraint {
    test(value: string) {
        throw 'please override the test fiel in ' + this.constructor.name;
    }
}

export class NonEmpty extends Constraint {
    constructor() {
        super();
    }
    test(value: string): string {
        if(value === undefined) return;
        if(value.length === 0) {
            return 'please input a value in that field';
        }
     }
}

export class AtLeast extends Constraint {
    constructor(least: number) {
        super();
        this.least = least;
    }
    least: number;
    test(value: string): string {
        if(value === undefined) return;
        if(value.length !>= this.least) {
            return 'That field require at least '+ this.least + 'characters';
        }
     }
}

export class AtMost extends Constraint {
    constructor(most: number) {
        super();
        this.most = most;
    }
    most: number;
    test(value: string) {
        if(value === undefined) return;
        if(value.length !<= this.most) {
            return 'That field cannot be more than '+ this.most + 'characters';
        }
     }
}

export class Email extends Constraint {
    test(value: string) {
        if(value === undefined) return;
        const re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
        if( !re.test(value) ) return 'That email address is invalid';
    }
}

type InputProps = {
    type?: string;
    label?: string;
    constraints?: Constraint[];
    value: string;
    onChange: (e: any) => void;
}

type InputState = {
    value: string;
}

export class Input extends React.Component< InputProps, InputState > {

    public static defaultProps: any = { constraints: [] };

    get isValid():boolean {
        return !this.props.constraints.filter((c: Constraint) => c.test(this.props.value)).length;
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
                    { this.props.constraints.map((c: Constraint) => c.test(this.props.value) ) }
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
                    { this.props.constraints.map((c: Constraint) => c.test(this.props.value) ) }
                </div>
            </div>
        );
    }
}

import './Input.scss';