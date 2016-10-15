import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';

import { View } from '../../crankshaft/view';

class LoginState {
  identifier: string;
  password: string;

}

const loginState = new LoginState();

export class Login extends View {

  constructor(props: any) {
    super(props);
  }

  get content() {
    return (
      <div className='login'>
        <label></label>
        <input id='identifier' value={loginState.identifier} />
      </div>
    );
  }
}