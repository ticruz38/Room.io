import * as React from 'react';
import * as mobx from 'mobx';
import * as guid from 'node-uuid';
import { observer } from 'mobx-react';
import { Input, newField } from 'components/form';
import { nonEmpty, email, hasChanged } from 'components/form/Constraint';
//models
import StuffModel from 'models/stuff';
//layout
import { layoutState } from 'routes/layout/Layout';

// Profile
import { profileState } from 'routes/profile/Profile';
import StuffEditor from './StuffEditor';


@observer
export default class RoomEditor extends React.Component< Room, any > {
  componentWillMount() {
    const {name, description, email} = this.props;
    this.state = mobx.observable({
      name: newField( name, [hasChanged(name), nonEmpty()], false ),
      description: newField( description, [hasChanged(description), nonEmpty()], false ),
      email: newField( email, [hasChanged(email), nonEmpty()], false )
    })
  }

  get newStuff() {
    return new StuffModel( { _id: guid.v1(), roomId: this.props._id } );
  }

  render() {
    const { name, description, email } = this.state;
    return (
      <div className="room">
        <div className="action-button">
          <button
            className='btn'
            onClick={ _ => layoutState.modal = <StuffEditor { ...this.newStuff } /> }
          >Add Stuff</button>
        </div>
        <h2>Room</h2>
        <Input field={ this.state.name } type="text" placeholder="room name" />
        <Input field={ this.state.description } type="text" placeholder="room description" />
        <Input field={ this.state.email } type="text" placeholder="room email" />
      </div>
    );
  }
}