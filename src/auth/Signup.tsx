import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';
import Login from './Login';
import { Input, Field } from '../form';
import { password, nonEmpty } from '../form/Constraint';
import { layoutState } from '../tools/Layout';




class SignupState {

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
}

const signupState = new SignupState();

export default class Signup extends React.Component< any, SignupState > {

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
        <div className="question">
          <button onClick={ _ => layoutState.modal = <Login/> }>Not a member yet ?</button>
        </div>
      </div>
    );
  }
}

import './signup.scss';
