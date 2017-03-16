import * as React from "react";
import * as guid from 'node-uuid';
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';


import { Input } from 'components/form';
import { password, nonEmpty, sameAs, email } from 'components/form/Constraint';

import Login from 'routes/auth/Login';
import { layoutState } from 'routes/layout/Layout';
import Loader from 'graph/Loader';

import { EditableUser } from "models";

@observer
export default class Signup extends React.Component<any, any> {
    user: EditableUser = new EditableUser( {} )

    onSave = (result) => {
        sessionStorage.setItem( 'user', JSON.stringify( result.data.signup ) )
        layoutState.isLogged = true
    } 
    @computed get isValid(): boolean {
        return (
            this.user.name.isValid &&
            this.user.email.isValid &&
            this.user.password.isValid &&
            this.user.confirmPassword.isValid
        );
    }
    render() {
        return (
            <div className='signup'>
                <Input
                    label='Name/Pseudo'
                    field={this.user.name}
                    type='text'
                />
                <Input
                    label="Email"
                    field={this.user.email}
                    type="email"
                />
                <Input
                    label='Password'
                    field={this.user.password}
                    type='password'
                />
                <Input
                    label='Confirm Password'
                    field={this.user.confirmPassword}
                    type='password'
                />
                <div className="question">
                    <button onClick={_ => layoutState.modal = <Login />}>Already a member ?</button>
                </div>
                <div className="action-button">
                    {
                        this.isValid ?
                            <button onClick={_ => this.user.signup()}>
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
