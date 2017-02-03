import * as React from "react";
import * as guid from 'node-uuid';
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';
import Login from './Login';
import { Input } from '../form';
import { password, nonEmpty, sameAs, email } from '../form/Constraint';
import { layoutState } from '../layout/Layout';
import Loader from '../graphql-client/Loader';

const Document = require('./Signup.gql');



class SignupState {

    @observable _id: String;

    @observable name: Field = {
        value: undefined,
        constraints: [nonEmpty()],
        isValid: false
    };

    @observable password: Field = {
        value: undefined,
        constraints: [password()],
        isValid: false
    };

    @observable email: Field = {
        value: undefined,
        constraints: [email()],
        isValid: false
    }

    @observable confirmPassword: Field = {
        value: undefined,
        constraints: [sameAs(this.password)],
        isValid: false
    };

    signup() {
        Loader.execute( Document, 'Signup', this.format() ).then( result => {
            sessionStorage.setItem( 'user', JSON.stringify(result.data) )
            layoutState.isLogged = true;
        } );
    }

    format() {
        return {
            "User": {
                _id: this._id || guid.v1(),
                name: this.name.value,
                email: this.email.value,
                password: this.password.value,
            }
        };
    }
}

export const signupState = new SignupState();



@observer
export default class Signup extends React.Component<any, SignupState> {
    @computed get isValid(): boolean {
        return (
            signupState.name.isValid &&
            signupState.email.isValid &&
            signupState.password.isValid &&
            signupState.confirmPassword.isValid
        );
    }

    render() {
        console.log(this.isValid);
        return (
            <div className='signup'>
                <Input
                    label='Name/Pseudo'
                    field={signupState.name}
                    type='text'
                />
                <Input
                    label="Email"
                    field={signupState.email}
                    type="email"
                />
                <Input
                    label='Password'
                    field={signupState.password}
                    type='password'
                />
                <Input
                    label='Confirm Password'
                    field={signupState.confirmPassword}
                    type='password'
                />
                <div className="question">
                    <button onClick={_ => layoutState.modal = <Login />}>Already a member ?</button>
                </div>
                <div className="action-button">
                    {
                        this.isValid ? 
                        <button onClick={ _ => signupState.signup() }>
                            Signup
                        </button> : 
                        null
                    }
                </div>
            </div>
        );
    }
}

import './signup.scss';
