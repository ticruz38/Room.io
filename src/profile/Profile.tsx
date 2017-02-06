import * as React from 'react';

import {Input} from '../form';
import {nonEmpty, email} from '../form/Constraint';
import { layoutState } from '../layout/Layout';


const Document = require('./Profile.gql');




class ProfileState {
    _id: String;
    name: Field = {
        value: undefined,
        isValid: false,
        constraints: [nonEmpty()]
    };
    email: Field = {
        value: undefined,
        isValid: false,
        constraints: [email()]
    };
    rooms: String[];
}

const profileState = new ProfileState();

export class Profile extends React.Component< any, any > {

    componentWillMount() {
        layoutState.title = "Profile";
    }
    
    render() {
        return (
            <div className="profile">
                <img src='' />
                <div className="user-information">
                    <Input
                        label='Name'
                        field={profileState.name}
                        type="text"
                    />
                    <Input
                        label='Email'
                        field={profileState.email}
                        type="email"
                    />
                </div>
                <div className="rooms">

                </div>
            </div>
        )
    }
}