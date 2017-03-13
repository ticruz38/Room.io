import * as React from "react";
import { computed, observable, toJS, autorun } from 'mobx';
import { observer } from 'mobx-react';

import { Input } from 'components/form';
import { password, email } from 'components/form/Constraint';
import { layoutState } from 'routes/layout/Layout';
import Loader from 'graph/Loader';
import Signup from './Signup';
import loadApp from '../../';

import { EditableUser } from "models";

const Document = require( './Login.gql' );


class LoginState {
    user: EditableUser = new EditableUser( {} );
    @observable errors: String[] = []
    login() {
        Loader.execute( Document, 'Login', this.user.toUserInput() ).then( result => {
            if ( result.data['login'] ) {
                sessionStorage.setItem( "user", JSON.stringify( result.data['login'] ) )
                layoutState.isLogged = true
                layoutState.modal = false;
                loadApp();
            }
            if ( result.errors ) {
                loginState.errors = result.errors.map( e => e.message );
            }
        } );
    }
}

export const loginState = new LoginState();




@observer
export default class Login extends React.Component<any, LoginState> {
    render() {
        const { user } = loginState;
        return (
            <div className='login'>
                <Input
                    label='Email'
                    field={user.email}
                    type='text'
                />
                <Input
                    label='Password'
                    field={user.password}
                    type='text'
                />
                <div className="question">
                    <button onClick={_ => layoutState.modal = <Signup />}>Not a member yet ?</button>
                </div>
                <div className="errors">
                    {loginState.errors.map( e => <div>{e}</div> )}
                </div>
                <div className="action-button">
                    {
                        user.isValid ?
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

