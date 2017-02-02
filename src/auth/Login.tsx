import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';

import Signup from './Signup';
import { Input, Field } from '../form';
import { password, nonEmpty } from '../form/Constraint';
import { layoutState } from '../layout/Layout';
import Loader from '../graphql-client/Loader'; 

const Document = require('./Login.gql');




class LoginState {

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

  login() {
      Loader.execute(Document, 'Login', )
  }
}

export const loginState = new LoginState();

export default class Login extends React.Component< any, LoginState > {
  render() {
    return (
      <div className='login'>
        <Input
          label='Name/Pseudo'
          field={loginState.name}
          type='text'
        />
        <Input
          label='Password'
          field={loginState.password}
          type='text'
        />
        <div className="question">
          <button onClick={ _ => layoutState.modal = <Signup/> }>Not a member yet ?</button>
        </div>
      </div>
    );
  }
}

import './Login.scss';
