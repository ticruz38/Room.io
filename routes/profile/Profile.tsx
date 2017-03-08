import * as React from 'react';
import * as mobx from 'mobx';
import * as guid from 'node-uuid';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import { Input, newField } from 'components/form';
import { nonEmpty, email, hasChanged } from 'components/form/Constraint';
import { layoutState } from 'routes/layout/Layout';
import Loader from 'graph/Loader';

//Profile 
import RoomEditor from './visuals/RoomEditor';
import StuffEditor from './visuals/StuffEditor';
import EditButtons from './visuals/EditButtons';

//models 
import * as models from 'models';

const Document = require('./Profile.gql');



class ProfileState extends Loader {
    _id: string = layoutState.user._id;

    @mobx.observable name: Field = new models.Field( "", [nonEmpty(), hasChanged(layoutState.user['name'])])

    @mobx.observable email: Field = new models.Field( "", [email(), hasChanged(layoutState.user["email"])])

    @mobx.observable room: Room;

    @mobx.observable picture: string;

    @mobx.computed get saveable(): boolean {
        return (
            this.name.isValid ||
            this.email.isValid
        );
    }

    createRoom() {
        this.execute('CreateRoom', {
            variables: {room: new models.RoomInput(this._id) },
            cb: (data: any) => {
                this.room = data.addRoom;
            }
        })
    }

    deleteRoom() {
        this.execute( 'DeleteRoom', {
            variables: {id: this.room._id },
            cb: (data: any) => {
                this.room = null;
            }
        })
    }

    @mobx.computed get toolbar() {
        const SaveButton = this.saveable ? <button>Save Changes</button> : null;
        const CreateRoom = this.room ?
            null :
            <button onClick={ _ => this.createRoom() } >Add a room</button>;
        return (
            <div>
                {SaveButton}
                {CreateRoom}
            </div>
        );
    }

    read(data) {
        const { profile } = data;
        if (!profile) throw 'oops, profile hasnt been fetched';
        this.name.value = profile.name;
        this.email.value = profile.email;
        this.room = profile.room ? mobx.extendObservable(this.room || {}, profile.room) : null;
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
        layoutState.reset();
        layoutState.title = "Profile";
        layoutState.backgroundImage = "https://vanessaberryworld.files.wordpress.com/2013/10/teen-room-desk.jpg";
        mobx.autorun(_ => layoutState.toolBar = profileState.toolbar);
    }

    @mobx.computed get categories() {
        const categories = {};
        ( profileState.room.stuffs || []).map( s => categories[s.category] ? categories[s.category].push(s) : categories[s.category] = [s] )
        return categories;
    }

    get categoriesElement() {
        const onClose = (stuff) => {
            const index = profileState.room.stuffs.findIndex( s => stuff._id === s._id );
            profileState.room.stuffs.splice(index, 1);
        };
        return profileState.room ?
            Object.keys(this.categories).map(key => (
                <div className="category card">
                    <h2>{key}</h2>
                    <table key={key} className='profile-stuffs'>
                        { this.categories[key].map(s => (
                            <tr key={s._id} className="stuff">
                                <td className="name">{s.name}</td>
                                <td>
                                    <div className="description">
                                        {s.description}
                                        <button className="btn" onClick={e => onClose(e)}>
                                            <i className="material-icons">close</i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) ) }
                    </table>
                </div>
            )) :
            null
    }

    render() {
        return (
            <div className="profile">
                <div className="profile-header">
                    <img src={profileState.picture ? 'https://ipfs.io/ipfs/' + profileState.picture : 'https://www.jimfitzpatrick.com/wp-content/uploads/2012/10/Che-detail-1.jpg'} />
                    <div className="user-information card">
                        <h2>Profile Information</h2>
                        <Input
                            field={profileState.name}
                            type="text"
                            placeholder="name"
                        />
                        <Input
                            field={profileState.email}
                            type="email"
                            placeholder="email"
                        />
                    </div>
                </div>
                <div className='profile-room'>
                    { profileState.room ? <RoomEditor { ...profileState } /> : null }
                    { this.categoriesElement }
                </div>
            </div>
        )
    }
}

import './Profile.scss';