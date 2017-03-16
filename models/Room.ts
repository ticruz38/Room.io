import * as guid from 'node-uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';

import { Field, EditableStuff, EditableOrder } from 'models';
import Loader from "graph/Loader";
import Editable from "models/Editable";

const Document = require('./models.gql');

export class EditableRoom extends Editable {
    _id: string;
    userId: string;
    @mobx.observable name: Field< string >;
    description: Field< string >;
    email: Field< string >;
    phoneNumber: Field< string >;
    picture?: Field< string >;
    @mobx.observable stuffs: EditableStuff[];
    @mobx.observable orders: EditableOrder[];
    save = (cb?: Function) => this.execute( 'SaveRoom', { room: this.toInput() } )

    delete = (cb?: Function) => this.execute( 'DeleteRoom', { id: this._id } )

    // observe graphql subscription
    constructor(room?: Room, userId?: string ) {
        super();
        if( !room && !userId ) throw 'please pass either a room or an userId as arguments in EditableRoom constructor';
        this._id = room ? room._id : guid.v1();
        this.userId = room && room.owner ? room.owner._id : userId;
        this.name = new Field( room ? room.name  : "" ); 
        this.description = new Field( room ? room.description  : "" ); 
        this.email = new Field( room ? room.email  : "" ); 
        this.phoneNumber = new Field( room ? room.phoneNumber  : "" );
        this.picture = new Field(room ? room.picture : null );
        this.stuffs = !!room && !!room.stuffs ? room.stuffs.map( s => new EditableStuff(s) ) : [];
        this.orders = !!room && !!room.orders ? room.orders.map( o => new EditableOrder(o) ) : [];
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
        public categories?: string[],
        public stuffs?: StuffInput[]
    ) {
        this._id = guid.v1();
    }
}
