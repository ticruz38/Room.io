import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import { Input } from 'components/form';
import { nonEmpty, email, hasChanged } from 'components/form/Constraint';
import { layoutState } from 'routes/layout/Layout';
import Loader from 'graph/Loader';


const Document = require('./Profile.gql');




class ProfileState extends Loader {
  _id: String = layoutState.user["_id"];
  @mobx.observable name: Field = {
    value: layoutState.user['name'],
    isValid: false,
    constraints: [nonEmpty(), hasChanged(layoutState.user['name'])]
  };
  @mobx.observable email: Field = {
    value: layoutState.user['email'],
    isValid: false,
    constraints: [email(), hasChanged(layoutState.user["email"])]
  };
  @mobx.observable rooms: Room[] = [];
  @mobx.observable picture: String;

  read(data) {
    const profile = data['profile'];
    if (!profile) throw 'data prop profile is null';
    this.name.value = profile.name;
    this.email.value = profile.email;
    this.rooms = profile.room || [];
    this.picture = profile.picture;
  }
}
// TODO see if the execute should not only happen in the willMount cb of the component
const profileState = new ProfileState(Document, 'ProfileQuery', {
  variables: { id: layoutState.user["_id"] },
  cb: (data) => {
    profileState.read(data);
  }
});




@observer
export default class Profile extends React.Component<any, any> {

  @mobx.computed get isUpdatable(): Boolean {
    return (
      profileState.name.isValid ||
      profileState.email.isValid
    );
  }

  componentWillMount() {
    layoutState.title = "Profile";
    layoutState.backgroundImage = "https://vanessaberryworld.files.wordpress.com/2013/10/teen-room-desk.jpg"
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
          <img src={profileState.picture ? 'https://ipfs.io/ipfs/' + profileState.picture : 'https://www.jimfitzpatrick.com/wp-content/uploads/2012/10/Che-detail-1.jpg'} />
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
          {profileState.rooms.map(r => (
            <div className="room">
              <h4>{r.name}</h4>
              <p>{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

import './Profile.scss';