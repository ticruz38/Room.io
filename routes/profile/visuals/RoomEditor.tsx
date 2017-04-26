import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { Input } from 'components/form';
import { Select } from 'components';
//models
import { StuffInput, Field, EditableRoom, EditableStuff, EditableUser } from 'models';
//layout
import { layoutState } from 'routes/layout/Layout';

// Profile
import { profileState } from 'routes/profile/Profile';
import StuffEditor from './StuffEditor';
import { IpfsImage } from "components";




@observer
export default class RoomEditor extends React.Component< EditableUser, any > {
    render() {
        const { room } = this.props;
        return (
            <div className="room card">
                <h2>Room</h2>
                <i className="material-icons close" onClick={ e => room.delete( _ => profileState.user.room = null ) }>close</i>
                <IpfsImage
                    picture={ room.picture }
                    onUpload={ (err, res) => {
                        room.picture.value = res[0].hash
                        {/*console.log(room.picture.value);*/}
                        room.picture.hasChanged = true;
                    } }
                    defaultPicture="https://d30y9cdsu7xlg0.cloudfront.net/png/204988-200.png"
                />
                <Input field={room.name} type="text" placeholder="name" />
                <Input field={room.description} type="text" placeholder="description" />
                <Input field={room.email} type="text" placeholder="email" />
                <Input field={room.phoneNumber} type="text" placeholder="phone-number" />
                <Select 
                    placeholder="Add tags..."
                    values={ {
                        options: [],
                        filters: room.tags
                    } }
                    allowCreate
                />
                <div className="action-button">
                    <button
                        className="btn"
                        onClick={_ => layoutState.modal = <StuffEditor roomId={ room._id }/>}
                    >Add Stuff
                    </button>
                </div>
            </div>
        );
    }
}