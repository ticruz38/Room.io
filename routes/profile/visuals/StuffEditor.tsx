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

interface StuffProps extends StuffInput {
    roomId: string;
}

@observer
export default class StuffEditor extends React.Component<EditableStuff, any> {

    save() {
        profileState.execute('SaveStuff', {
            variables: this.props.toStuffInput(),
            cb: (data: any) => {
                profileState.room.stuffs.push(data.addStuff)
                layoutState.modal = null;
            }
        });
    }

    render(): React.ReactElement< any > {
        const { name, description, picture, price, category } = this.props;
        return (
            <div className="stuff">
                <Input field={name} type="text" placeholder="Stuff Name" />
                <Input field={description} type="text" placeholder="Stuff Description" />
                <Input field={category} type="text" placeholder="Stuff Category" />
                {this.props.isValid ?
                    <button className="btn" onClick={_ => this.save() }>Save</button> :
                    null
                }
            </div>
        );
    }
}