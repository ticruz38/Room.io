import * as guid from 'node-uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';

export { UserInput, EditableUser } from 'models/User';


export class EditableStuff {
    write: () => StuffInput;
    constructor(stuff: Stuff) {}
}
export class StuffInput implements StuffInput {
    _id: string;

    constructor(
        public roomId: string,
        public name: string = '',
        public description: string = '',
        public category: string = '',
        public picture?: string,
        public price?: number
        ) {
        this._id = guid.v1();
    }
}

export class EditableRoom {
    write: () => RoomInput;
    constructor(room: Room) {}
}
export class RoomInput implements RoomInput {
    _id: string;

    constructor(
        public userId: string,
        public name: string = "",
        public description?: string,
        public email?: string,
        public phoneNumber?: string,
        public picture?: string,
        public categories?: string[],
        public stuffs?: StuffInput[]
    ) {
        this._id = guid.v1();
    }
}

export class EditableOrder {
    _id: string;
    clientId: string;
    roomId: string;
    @mobx.observable stuffIds: string[]
    message: Field< string >;
    @mobx.observable payed: boolean;
    @mobx.observable amount: Field< number >;
    toOrderInput(): OrderInput {
        return {
            _id: this._id,
            clientId: this.clientId,
            roomId: this.roomId,
            stuffIds: this.stuffIds,
            message: this.message.value,
            payed: this.payed,
            amount: this.amount.value
        }
    };
    constructor(order?: Order, clientId?: string, roomId?: string) {
        this._id = !!order ? order._id : guid.v1();
        this.clientId = !!order && order.client ? order.client._id : clientId;
        this.roomId = !!order && order.room ? order.room._id : roomId;
        this.stuffIds = !!order && order.stuffs ? order.stuffs.map( _ => _._id ) : [];
        this.message = new Field( order ? order.message : "" );
        this.payed = order ? order.payed : false;
        this.amount = new Field( order ? order.amount : 0 );
    }
}
export class OrderInput implements OrderInput {
    _id: string;
    constructor( 
        public roomId: string, 
        public clientId: string, 
        public stuffIds: string[],
        public message: string = "",
        public payed: boolean = false,
        public amount?: number
    ) {
        this._id = guid.v1();
    }
}


export class Field< T > {
    @mobx.observable value: T;
    @mobx.observable isValid: boolean;
    @mobx.observable hasChanged: boolean = false;
    constructor(
        value: T,
        public constraints: Function[] = [],
        isValid: boolean = false
    ) {}
}