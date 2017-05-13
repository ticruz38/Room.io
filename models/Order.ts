import * as guid from 'uuid';
import * as mobx from 'mobx';
import * as moment from 'moment';
import * as C from 'components/form/Constraint';

import { Field } from 'models';
import Editable from "models/Editable";

export class EditableOrder extends Editable {
    _id: string;
    clientId: string;
    roomId: string;
    created: number;
    @mobx.observable stuffIds: string[];
    message: Field< string >;
    @mobx.observable payed: boolean;
    @mobx.observable treated?: number; // date in unix

    removeStuff(id: string) {
        const index = this.stuffIds.findIndex( sId => sId === id );
        this.stuffIds.splice(index, 1);
    }
    update = (cb?: Function) => this.execute( 'UpdateOrder', { order: this.toInput() } )
    create = (cb?: Function) => this.execute( 'CreateOrder', { order: this.toInput() } )
    delete = (cb?: Function) => this.execute( 'DeleteOrder', { id: this._id } )
    constructor(order?: Order, clientId?: string, roomId?: string) {
        super();
        if ( !order && ( !clientId || !roomId ) ) throw 'please pass required argument for EditableOrder';
        this._id = !!order ? order._id : guid.v1();
        this.created = !!order ? order.created : moment().unix();
        this.clientId = !!order && order.client ? order.client._id : clientId;
        this.roomId = !!order && order.room ? order.room._id : roomId;
        this.stuffIds = !!order && order.stuffs ? order.stuffs.filter(o => !!o).map( _ => _._id ) : [];
        this.message = new Field( order ? order.message : "" );
        this.payed = order ? order.payed : false;
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