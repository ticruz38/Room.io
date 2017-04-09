import * as guid from 'uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';

export { UserInput, EditableUser } from 'models/User';
export { OrderInput, EditableOrder } from 'models/Order';
export { RoomInput, EditableRoom } from 'models/Room';
export { StuffInput, EditableStuff } from 'models/Stuff';


export class Field< T > {
    @mobx.observable value: T;
    @mobx.observable isValid: boolean;
    @mobx.observable hasChanged: boolean = false;
    constructor(
        value: T,
        public constraints: Function[] = [],
    ) {
        this.value = value;
        this.isValid = !constraints.some( c => !c(value).isValid );
    }
}