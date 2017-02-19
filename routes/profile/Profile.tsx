import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import { Input, newField } from 'components/form';
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
    constraints: [ email(), hasChanged( layoutState.user["email"] ) ]
  };

  @mobx.observable room: Room;

  @mobx.observable picture: String;

  @mobx.computed get saveable(): Boolean {
    return (
      this.name.isValid ||
      this.email.isValid
    );
  }

  @mobx.computed get toolbar() {
    return (
      <div className="profile-buttons">
        <Link to="start/room">Open a Room</Link>
        { this.saveable ? <button>Save Changes</button> : null }
      </div>
    );
  }

  read(data) {
    const profile = data['profile'];
    console.log(profile);
    if (!profile) throw 'data prop profile is null';
    this.name.value = profile.name;
    this.email.value = profile.email;
    this.room = mobx.extendObservable(this.room || {}, profile.room);
    this.picture = profile.picture;
  }
}
// TODO see if the execute should not only happen in the willMount cb of the component
const profileState = new ProfileState( Document );




@observer
export default class Profile extends React.Component<any, any> {

  loadData() {
    profileState.execute('ProfileQuery', {
      variables: { id: layoutState.user["_id"] },
      cb: (data) => {
        profileState.read(data);
      }
    } );
  }

  componentWillMount() {
    this.loadData();
    layoutState.title = "Profile";
    layoutState.backgroundImage = "https://vanessaberryworld.files.wordpress.com/2013/10/teen-room-desk.jpg";
    mobx.autorun( _ => layoutState.toolBar = profileState.toolbar );
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
        <div className='profile-room'>
          { profileState.room ? <RoomElement { ...profileState.room} /> : null }
        </div>
      </div>
    )
  }
}


@observer
class RoomElement extends React.Component< Room, any > {
  componentWillMount() {
    const {name, description, email} = this.props;
    this.state = mobx.observable({
      name: newField( name, [hasChanged(name), nonEmpty()], false ),
      description: newField( description, [hasChanged(description), nonEmpty()], false ),
      email: newField( email, [hasChanged(email), nonEmpty()], false )
    })
  }

  render() {
    const {name, description, email} = this.state;
    return (
      <div className="room">
        <div className="action-button">
          <button className='btn'>Add Stuff</button>
        </div>
        <h2>Room</h2>
        <Input field={ this.state.name } type="text" placeholder="room name" />
        <Input field={ this.state.description } type="text" placeholder="room description" />
        <Input field={ this.state.email } type="text" placeholder="room email" />
      </div>
    );
  }
}

import './Profile.scss';