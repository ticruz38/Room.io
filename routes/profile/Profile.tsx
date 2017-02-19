import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import { Input, newField } from 'components/form';
import { nonEmpty, email, hasChanged } from 'components/form/Constraint';
import { layoutState } from 'routes/layout/Layout';
import Loader from 'graph/Loader';

//Profile 
import RoomEditor from './visuals/RoomEditor';
import StuffEditor from './visuals/StuffEditor';





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
        {this.saveable ? <button>Save Changes</button> : null}
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
export const profileState = new ProfileState(Document);




@observer
export default class Profile extends React.Component<any, any> {

  loadData() {
    profileState.execute('ProfileQuery', {
      variables: { id: layoutState.user["_id"] },
      cb: (data) => {
        profileState.read(data);
      }
    });
  }

  componentWillMount() {
    this.loadData();
    layoutState.title = "Profile";
    layoutState.backgroundImage = "https://vanessaberryworld.files.wordpress.com/2013/10/teen-room-desk.jpg";
    mobx.autorun(_ => layoutState.toolBar = profileState.toolbar);
  }

  @mobx.computed get categories() {
    const categories = {}
    profileState.room.stuffs.map(s => categories[s.category] ? categories[s.category].push(s) : categories[s.category] = [s])
    console.log(categories)
    return categories;
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
          {profileState.room ? <RoomEditor { ...profileState.room } /> : null}
        </div>
        { profileState.room ?
          Object.keys(this.categories).map(key => (
              <div className="category">
                <h1>{key}</h1>
                <div key={key} className='profile-stuffs'>
                { this.categories[key].map(s => (
                  <div key={s._id} className="stuff">
                    <h3>{s.name}</h3>
                    <div>{s.description}</div>
                    <div>{s.category}</div>
                  </div>)
                ) }
                </div>
              </div>
           ) ) :
          null
        }
      </div>
    )
  }
}

import './Profile.scss';