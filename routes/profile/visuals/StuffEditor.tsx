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
import { Button } from "components";

interface StuffProps {
    roomId: string;
}

@observer
export default class StuffEditor extends React.Component<StuffProps, any> {

    @mobx.observable stuff: EditableStuff = new EditableStuff(null, this.props.roomId )

    onSave = ( result ) => {
        profileState.room.stuffs.push( this.stuff )
        layoutState.setModal(null);
    }

    render(): React.ReactElement< any > {
        const { name, description, picture, price, category } = this.stuff;
        return (
            <div className="stuff">
                <Input field={name} type="text" placeholder="Stuff Name" />
                <Input field={description} type="text" placeholder="Stuff Description" />
                <Input field={category} type="text" placeholder="Stuff Category" />
                <Input field={price} type="number" placeholder="Stuff Price" min={0}/>
                { this.stuff.isValid ?
                    <Button 
                        className="btn" 
                        message="Save"
                        action={_ => this.stuff.save( this.onSave ) }/> :
                    null
                }
            </div>
        );
    }
}