import * as guid from 'uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';
import { Field } from 'models';
import Loader from "graph/Loader";
import Editable from "models/Editable";

const Document = require('./models.gql');


export class EditableStuff extends Editable {
    _id: string;
    roomId: string;
    @mobx.observable name: Field< string >;
    @mobx.observable category: Field< string >;
    @mobx.observable description: Field< string >;
    @mobx.observable picture: Field< string >;
    @mobx.observable price: Field< number >;

    save = ( cb?: Function ) => this.execute( 'SaveStuff', { stuff: this.toInput() }, cb )
    
    delete = ( cb?: Function ) => this.execute( 'DeleteStuff', { id: this._id }, cb )

    // observe (graphql subscription...)
    constructor(stuff: Stuff, roomId?: string) {
        super();
        if( !stuff && !roomId ) throw 'please pass either Stuff or roomId as EditableStuff constructor arguments';
        this._id = stuff ? stuff._id : guid.v1();
        this.roomId = stuff && stuff.room ? stuff.room._id : roomId;
        this.name = new Field( stuff ? stuff.name : "", [C.nonEmpty()]);
        this.category = new Field( stuff ? stuff.category : "", [C.nonEmpty()] );
        this.description = new Field( stuff ? stuff.description : "", [C.nonEmpty()] );
        this.picture = new Field( stuff ? stuff.picture : "" );
        this.price = new Field( stuff ? stuff.price || 0 : 0 );
    }
}

export class StuffInput implements StuffInput {
    _id: string = guid.v1();

    constructor(
        public roomId: string,
        public name: string = '',
        public description: string = '',
        public category: string = '',
        public picture?: string,
        public price?: number
    ) {}
}