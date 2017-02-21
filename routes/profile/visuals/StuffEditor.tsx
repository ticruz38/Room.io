import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react'
import {Input, newField} from 'components/form';
import { nonEmpty, email, hasChanged } from 'components/form/Constraint';

//profile
import { profileState } from '../Profile';

//layout
import { layoutState } from 'routes/layout/Layout';

interface StuffProps extends Stuff {
  roomId?: string;
  mode?: 'create' | 'update';
}

@observer
export default class StuffEditor extends React.Component< StuffProps, any > {
  static defaultProps: {
    mode: 'create'
  }

  @mobx.computed get isValid(): boolean {
    const { name, description, category } = this.state;
    return (
      name.isValid &&
      description.isValid &&
      category.isValid
    );
  }

  get formattedStuff() {
    const { _id } = this.props;
    const roomId = this.props.mode === 'create' ? this.props.room._id : this.props.roomId;
    const { name, description, category } = this.state;
    return {
      stuff: {
        _id,
        roomId,
        name: name.value,
        description: description.value,
        category: category.value
      }
    }
  }

  save() {
    profileState.execute( 'SaveStuff', {
      variables: this.formattedStuff,
      cb: (data: any) => {
        profileState.room.stuffs.push(data.addStuff)
        layoutState.modal = null;
      } 
    } );
  }

  update() {
    profileState.execute( 'UpdateStuff', {
      variables: this.formattedStuff,
      cb: (data: any) => {
        profileState.room.stuffs.push(data.addStuff)
        layoutState.modal = null;
      } 
    } );
  }

  componentWillMount() {
    const { name, description, picture, price, category } = this.props;
    this.state = mobx.observable({
      name: newField( name, [ hasChanged(name), nonEmpty() ], false ),
      description: newField( description, [ hasChanged(description), nonEmpty() ], false ),
      category: newField( category, [ hasChanged(category), nonEmpty() ], false ),
    })
  }

  render() {
    console.log(this.isValid, this.state)
    return (
      <div className="stuff">
        <Input field={ this.state.name } type="text" placeholder="Stuff Name" />
        <Input field={ this.state.description } type="text" placeholder="Stuff Description" />
        <Input field={ this.state.category } type="text" placeholder="Stuff Category" />
        { this.isValid ? <button className="btn" onClick={ _ => this.save() }>Save</button> : null }
      </div>
    );
  }
}