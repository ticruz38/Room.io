import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';

import { Input } from 'components/form';
import { password, email } from 'components/form/Constraint';
import Button from 'components/Button';
import Loader from 'graph/Loader';
import Signup from './Signup';
import { layoutState } from 'routes/layout/Layout';

import { EditableUser } from "models";

@observer
export default class Login extends React.Component<any, any> {

    user = new EditableUser({})
    @observable errors: any[] = []

    onSave = (result) => {
        if( result.errors) {
            console.log(result.errors);
            return this.errors = result.errors;
        }
        layoutState.isLogged = true;
        layoutState.setModal(false);
        sessionStorage.setItem( 'user', JSON.stringify( result.data.login ) );
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
                    type='password'
                />
                <div className="question">
                    <Button 
                        size="small"
                        message='Not a member yet'
                        action={_ => layoutState.setModal(<Signup />)}
                    />
                </div>
                <div className="errors">
                    {this.errors.map( e => <div>{e.message}</div> )}
                </div>
                <div className="action-button">
                    {
                        this.isValid ?
                            <Button
                                size="small"
                                message='Login'
                                action={_ => this.user.login( this.onSave )}
                            /> :
                            null
                    }
                </div>
            </div>
        );
    }
}

import './Login.scss';

