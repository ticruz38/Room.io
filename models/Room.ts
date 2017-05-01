import * as guid from 'uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';

import { Field, EditableStuff, EditableOrder } from 'models';
import Loader from "graph/Loader";
import Editable from "models/Editable";

const Document = require('./models.gql');

export class EditableRoom extends Editable {
    _id: string;
    userId: string;
    name: Field< string >;
    description: Field< string >;
    email: Field< string >;
    phoneNumber: Field< string >;
    picture?: Field< string >;
    @mobx.observable stuffs: EditableStuff[];
    @mobx.observable orders: EditableOrder[];
    @mobx.observable tags: string[];

    save = (cb?: Function) => this.execute( 'SaveRoom', { room: this.toInput() } )

    delete = (cb?: Function) => this.execute( 'DeleteRoom', { id: this._id } )

    // observe graphql subscription
    constructor(room?: Room, userId?: string ) {
        super();
        if( !room ) room = { _id: guid.v1() };
        if( !room.owner && !userId ) throw 'please pass either a room with an userID or an userId as arguments in EditableRoom constructor';
        this._id = room._id;
        this.userId = room.owner ? room.owner._id : userId;
        this.name = new Field( room.name ? room.name  : "", [ C.nonEmpty() ] ); 
        this.description = new Field( room.description ? room.description  : "" ); 
        this.email = new Field( room.email ? room.email  : "" );
        this.phoneNumber = new Field( room.phoneNumber ? room.phoneNumber  : "" );
        this.picture = new Field(room.picture ? room.picture : null );
        this.stuffs = !!room.stuffs ? room.stuffs.map( s => new EditableStuff(s) ) : [];
        this.orders = !!room.orders ? room.orders.map( o => new EditableOrder(o) ) : [];
        this.tags = room.tags || [];
    }
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
        public stuffs?: StuffInput[],
        public tags?: string[]
    ) {
        this._id = guid.v1();
    }
}
