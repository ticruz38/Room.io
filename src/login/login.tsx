import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';

class LoginState {

  @observable name: string;

  @observable password: string;

  @computed get nameError() {
    if (loginState.name === undefined) return;
    if (!loginState.name.length) return 'name cannot be empty';
    return null;
  }

  @computed get passwordError() {
    if (loginState.password === undefined) return;
    const re = /^(?=.*\d)[a-zA-Z0-9]{8,}$/i;
    if (!re.test(loginState.password)) return 'Password must contains 8 characters with uppercase letters and numbers';
    return null;
  }
}

const loginState = new LoginState();

export class Login extends React.Component< any, LoginState > {

  render() {
    return (
      <div className='form'>
        <div className='name'>
          <label>Name/Pseudo</label>
          <input
            id='name'
            className={loginState.nameError ? 'error' : ''}
            onChange={(e: any) => loginState.name = e.target.value}
            value={loginState.name}
          />
          <div className='error'>{loginState.nameError}</div>
        </div>
        <div className='password'>
          <label>password</label>
          <input
            className={loginState.passwordError ? 'error' : ''}
            id='password'
            onChange={(e: any) => loginState.password = e.target.value}
            value={loginState.password} />
          <div className='error'>{loginState.passwordError}</div>
        </div>
      </div>
    );
  }
}

import './login.scss';
