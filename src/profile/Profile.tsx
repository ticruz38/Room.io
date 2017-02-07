import * as React from 'react';
import { Link } from 'react-router';
import {Input} from '../form';
import {nonEmpty, email} from '../form/Constraint';
import { layoutState } from '../layout/Layout';


//const Document = require('./Profile.gql');




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
    rooms: Room[] = [];
    picture: String;
}

const profileState = new ProfileState();

export default class Profile extends React.Component< any, any > {

    componentWillMount() {
        layoutState.title = "Profile";
        layoutState.toolBar = (
          <div>
            <Link to="start/room">Open a Room</Link>
          </div>
        );
    }
    
    render() {
        return (
            <div className="profile">
                <div className="profile-header">
                  <img src={ profileState.picture ? 'https://ipfs.io/ipfs/' + profileState.picture : 'https://www.jimfitzpatrick.com/wp-content/uploads/2012/10/Che-detail-1.jpg' } />
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
                </div>
                <div className="rooms">
                  <h2>Rooms</h2>
                    { profileState.rooms.map( r => (
                      <div className="room">
                        <h4>{r.name}</h4>
                        <p>{r.description}</p>
                      </div>
                    ) ) }
                </div>
            </div>
        )
    }
}

import './Profile.scss';