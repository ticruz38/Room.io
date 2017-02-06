import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';

import Signup from './Signup';
import { Input, Field } from '../form';
import { password, email } from '../form/Constraint';
import { layoutState } from '../layout/Layout';
import Loader from '../graphql-client/Loader';
import { loadApp } from '../';

const Document = require('./Login.gql');


class LoginState {

  @observable _id: String;

  @observable email: Field = {
    value: undefined,
    constraints: [email()],
    isValid: false
  };

  @observable password: Field = {
    value: undefined,
    constraints: [password()],
    isValid: false
    };

  @observable errors: String[] = []

  get format() {
    return {
      password: this.password.value,
      email: this.email.value
    }
  }

  login() {
    Loader.execute(Document, 'Login', this.format).then(result => {
      if (result.data['login']) {
        sessionStorage.setItem("user", JSON.stringify(result.data['login']))
        layoutState.isLogged = true
        layoutState.modal = false;
        loadApp();
      }
      if (result.errors) {
        loginState.errors = result.errors.map(e => e.message);
      }
    });
  }
}

export const loginState = new LoginState();

@observer
export default class Login extends React.Component<any, LoginState> {
  @computed get isValid(): boolean {
    return (
      loginState.email.isValid &&
      loginState.password.isValid
    );
  }
  render() {
    return (
      <div className='login'>
        <Input
          label='Email'
          field={loginState.email}
          type='text'
        />
        <Input
          label='Password'
          field={loginState.password}
          type='text'
        />
        <div className="question">
          <button onClick={_ => layoutState.modal = <Signup />}>Not a member yet ?</button>
        </div>
        <div className="errors">
          {loginState.errors.map(e => <div>{e}</div>)}
        </div>
        <div className="action-button">
          {
            this.isValid ?
              <button onClick={_ => loginState.login()}>
                Login
              </button> :
              null
          }
        </div>
      </div>
    );
  }
}

import './Login.scss';
