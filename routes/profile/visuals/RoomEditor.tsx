import * as React from 'react';
import * as mobx from 'mobx';
import * as guid from 'node-uuid';
import { observer } from 'mobx-react';
import { Input } from 'components/form';
import { nonEmpty, email, hasChanged } from 'components/form/Constraint';
//models
import {StuffInput, Field} from 'models';
//layout
import { layoutState } from 'routes/layout/Layout';

// Profile
import {profileState } from 'routes/profile/Profile';
import StuffEditor from './StuffEditor';




@observer
export default class RoomEditor extends React.Component<any, any> {
    state: any;
    componentWillMount() {
        const {name, description, email} = profileState.room;
        this.state = mobx.observable({
            name: new Field(name, [hasChanged(name), nonEmpty()]),
            description: new Field(description, [hasChanged(description), nonEmpty()]),
            email: new Field(email, [hasChanged(email), nonEmpty()])
        })
    }

    render() {
        const { name, description, email } = this.state;
        return (
            <div className="room card">
                <h2>Room</h2>
                <i className="material-icons close" onClick={ _ => profileState.deleteRoom() }>close</i>
                <Input field={this.state.name} type="text" placeholder="room name" />
                <Input field={this.state.description} type="text" placeholder="room description" />
                <Input field={this.state.email} type="text" placeholder="room email" />
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