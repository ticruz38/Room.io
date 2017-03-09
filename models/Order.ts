import * as guid from 'node-uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';

import { Field } from 'models';

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