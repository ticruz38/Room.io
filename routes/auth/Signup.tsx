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

const Document = require( './Signup.gql' );



class SignupState {
    user: EditableUser = new EditableUser( {} )
    signup() {
        Loader.execute( Document, 'Signup', this.user.toUserInput() ).then( result => {
            sessionStorage.setItem( 'user', JSON.stringify( result.data['signup'] ) )
            layoutState.isLogged = true;
        } );
    }
}
export const signupState = new SignupState();



@observer
export default class Signup extends React.Component<any, SignupState> {
    render() {
        const { user } = signupState;
        return (
            <div className='signup'>
                <Input
                    label='Name/Pseudo'
                    field={user.name}
                    type='text'
                />
                <Input
                    label="Email"
                    field={user.email}
                    type="email"
                />
                <Input
                    label='Password'
                    field={user.password}
                    type='password'
                />
                <Input
                    label='Confirm Password'
                    field={user.confirmPassword}
                    type='password'
                />
                <div className="question">
                    <button onClick={_ => layoutState.modal = <Login />}>Already a member ?</button>
                </div>
                <div className="action-button">
                    {
                        user.isValid ?
                            <button onClick={_ => signupState.signup()}>
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
