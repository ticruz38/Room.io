import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';

class LoginState {

  @observable login;

  @observable password;

  @computed get loginError() {
    console.log('loginError', loginState.login);
    if (loginState.login === undefined) return;
    if (!loginState.login.length) return 'login cannot be empty';
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

export class Login extends React.Component {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className='form'>
        <div className='login'>
          <label>login</label>
          <input
            id='login'
            className={loginState.loginError ? 'error' : ''}
            onChange={e => loginState.login = e.target.value}
            value={loginState.login}
          />
          <div className='error'>{loginState.loginError}</div>
        </div>
        <div className='password'>
          <label>password</label>
          <input
            className={loginState.passwordError ? 'error' : ''}
            id='password'
            onChange={e => loginState.password = e.target.value}
            value={loginState.password} />
          <div className='error'>{loginState.passwordError}</div>
        </div>
      </div>
    );
  }
}

import './login.scss';
