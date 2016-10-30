import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';

class LoginState {
  @observable login: string;
  @observable password: string;
}

const loginState = new LoginState();

export class Login extends React.Component< any, LoginState > {

  constructor(props: any) {
    super(props);
  }

  get content() {
    return (
      <div className='login'>
        <label>Login</label>
        <input id='login' value={loginState.login} onChange={ (e) => loginState.login = e.target.value } />
        <label></label>
        <input id='password' value={ loginState.password} onChange={ (e) => loginState.password = e.target.value } />
      </div>
    );
  }
}