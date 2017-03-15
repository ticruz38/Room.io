import * as guid from 'node-uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';

import { Field, EditableStuff, EditableOrder } from 'models';
import Loader from "graph/Loader";

const Document = require('./models.gql');

export class EditableRoom {
    _id: string;
    userId: string;
    @mobx.observable name: Field< string >;
    description: Field< string >;
    email: Field< string >;
    phoneNumber: Field< string >;
    picture?: Field< string >;
    @mobx.observable stuffs: EditableStuff[];
    @mobx.observable orders: EditableOrder[];
    toRoomInput(): RoomInput {
        return {
            _id: this._id,
            userId: this.userId,
            name: this.name.value,
            description: this.description.value,
            email: this.email.value,
            phoneNumber: this.phoneNumber.value,
            picture: this.picture.value
        }
    }
    save(cb?: Function): void {
        Loader.execute( Document, 'SaveRoom', { room: this.toRoomInput } )
            .then( room => cb ? cb(room) : room, error => console.log( error ) );
    }

    delete(cb?: Function): void {
        Loader.execute( Document, 'DeleteRoom', {id: this._id } )
            .then( room => cb ? cb(room) : room, error => console.log( error ) );
    }

    // observe graphql subscription
    constructor(room?: Room, userId?: string ) {
        if( !room && !userId ) throw 'please pass either a room or an userId as arguments in EditableRoom constructor';
        this._id = room ? room._id : guid.v1();
        this.userId = room && room.owner ? room.owner._id : userId;
        this.name = new Field( room ? room.name  : "" ); 
        this.description = new Field( room ? room.description  : "" ); 
        this.email = new Field( room ? room.email  : "" ); 
        this.phoneNumber = new Field( room ? room.phoneNumber  : "" );
        this.picture = new Field(room ? room.picture : null );
        this.stuffs = !!room && !!room.stuffs ? room.stuffs.map( s => new EditableStuff(s, this._id) ) : [];
        this.orders = !!room && !!room.orders ? room.orders.map( o => new EditableOrder(o, this._id) ) : [];
    }
    @mobx.computed get hasChanged(): boolean {
        console.log('roomChanged');
        return this.name.hasChanged || 
        this.description.hasChanged || 
        this.email.hasChanged ||
        this.phoneNumber.hasChanged ||
        this.picture.hasChanged
    }
    @mobx.computed get isValid(): boolean {
        return this.name.isValid &&
        this.description.isValid &&
        this.email.isValid &&
        this.phoneNumber.isValid &&
        this.picture.isValid
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
