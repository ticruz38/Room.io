import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';

import { Input } from 'components/form';
import { password, email } from 'components/form/Constraint';
import { layoutState } from 'routes/layout/Layout';
import Loader from 'graph/Loader';
import Signup from './Signup';

import { EditableUser } from "models";

@observer
export default class Login extends React.Component<any, any> {

    user = new EditableUser({})
    @observable errors: string[] = []

    onSave = (result) => {
        if( result.errors) {
            return this.errors = result.errors;
        }
        sessionStorage.setItem( 'user', JSON.stringify( result.data.login ) );
        layoutState.isLogged = true
        layoutState.modal = null;
    }

    @computed get isValid() {
        return (
            this.user.email.isValid &&
            this.user.password.isValid
        )
    }
    render() {
        return (
            <div className='login'>
                <Input
                    placeholder='Email'
                    field={this.user.email}
                    type='text'
                />
                <Input
                    placeholder='Password'
                    field={this.user.password}
                    type='text'
                />
                <div className="question">
                    <button onClick={_ => layoutState.modal = <Signup />}>Not a member yet ?</button>
                </div>
                <div className="errors">
                    {this.errors.map( e => <div>{e}</div> )}
                </div>
                <div className="action-button">
                    {
                        this.isValid ?
                            <button onClick={_ => this.user.login( this.onSave )}>
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

