import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';
import Login from './Login';
import { Input, Field } from '../form';
import { password, nonEmpty, sameAs } from '../form/Constraint';
import { layoutState } from '../layout/Layout';




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

  @observable confirmPassword: Field = {
    value: undefined,
    constraints: [sameAs(this.name.value)],
    isValid: false
  };
}

export const signupState = new SignupState();




export default class Signup extends React.Component< any, SignupState > {
    isValid(): boolean {
        return (
            signupState.name.isValid &&
            signupState.password.isValid &&
            signupState.confirmPassword.isValid
        );
    }

    render() {
        return (
        <div className='signup'>
            <Input
                label='Name/Pseudo'
                field={signupState.name}
                type='text'
            />
            <Input
                label='Password'
                field={signupState.password}
                type='text'
            />
            <Input
                label='Confirm Password'
                field={signupState.confirmPassword}
                type='text'
            />
            <div className="question">
                <button onClick={ _ => layoutState.modal = <Login/> }>Already a member ?</button>
            </div>
            { this.isValid ? <button>Signup</button> : <span/> }
        </div>
        );
    }
}

import './signup.scss';
