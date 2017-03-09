import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { Input } from 'components/form';
//models
import { StuffInput, Field, EditableRoom } from 'models';
//layout
import { layoutState } from 'routes/layout/Layout';

// Profile
import { profileState } from 'routes/profile/Profile';
import StuffEditor from './StuffEditor';




@observer
export default class RoomEditor extends React.Component< EditableRoom, any > {
    render() {
        const { name, description, email } = this.props;
        return (
            <div className="room card">
                <h2>Room</h2>
                <i className="material-icons close" onClick={ _ => profileState.deleteRoom() }>close</i>
                <Input field={name} type="text" placeholder="room name" />
                <Input field={description} type="text" placeholder="room description" />
                <Input field={email} type="text" placeholder="room email" />
                <div className="action-button">
                    <button
                        className='btn'
                        onClick={_ => layoutState.modal = <StuffEditor { ...new StuffInput( this.props._id ) }/>}
                    >Add Stuff
                    </button>
                </div>
            </div>
        );
    }
}