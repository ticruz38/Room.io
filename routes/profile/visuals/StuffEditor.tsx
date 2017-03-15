import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react'
import { Input } from 'components/form';
import { nonEmpty, email, hasChanged } from 'components/form/Constraint';

//profile
import { profileState } from '../Profile';
import { EditableStuff } from "models";

//layout
import { layoutState } from 'routes/layout/Layout';

interface StuffProps {
    roomId: string;
}

@observer
export default class StuffEditor extends React.Component<StuffProps, any> {

    stuff: EditableStuff = new EditableStuff(null, this.props.roomId )

    onSave = ( result ) => {
        profileState.room.stuffs.push( this.stuff )
        layoutState.modal = null;
    }

    render(): React.ReactElement< any > {
        const { name, description, picture, price, category } = this.stuff;
        return (
            <div className="stuff">
                <Input field={name} type="text" placeholder="Stuff Name" />
                <Input field={description} type="text" placeholder="Stuff Description" />
                <Input field={category} type="text" placeholder="Stuff Category" />
                { this.stuff.isValid ?
                    <button className="btn" onClick={_ => this.stuff.save( this.onSave ) }>Save</button> :
                    null
                }
            </div>
        );
    }
}