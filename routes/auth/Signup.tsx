import * as React from "react";
import * as guid from 'uuid';
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';


import { Input } from 'components/form';
import { password, nonEmpty, sameAs, email } from 'components/form/Constraint';
import Button from "components/Button";

import Login from 'routes/auth/Login';
import { layoutState } from 'routes/layout/Layout';
import Loader from 'graph/Loader';

import { EditableUser } from "models";

@observer
export default class Signup extends React.Component<any, any> {
    user: EditableUser = new EditableUser( {} )

    onSave = (result) => {
        if( result.data.signup)
        sessionStorage.setItem( 'userId', result.data.signup._id )
        layoutState.user = result.data.signup;
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
                    placeholder='Name/Pseudo'
                    field={this.user.name}
                    type='text'
                />
                <Input
                    placeholder="Email"
                    field={this.user.email}
                    type="email"
                />
                <Input
                    placeholder='Password'
                    field={this.user.password}
                    type='password'
                />
                <Input
                    placeholder='Confirm Password'
                    field={this.user.confirmPassword}
                    type='password'
                />
                <div className="question">
                    <Button 
                        message="Already a member ?"
                        action={_ => layoutState.setModal(<Login />)}
                        size="small"
                    />
                </div>
                <div className="action-button">
                    {
                        this.isValid ?
                            <Button
                                action={_ => this.user.signup( this.onSave )}
                                message='Signup'
                                size="small"
                            /> : null
                    }
                </div>
            </div>
        );
    }
}

import './signup.scss';

