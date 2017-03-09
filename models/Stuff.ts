import * as guid from 'node-uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';
import { Field } from 'models';



export class EditableStuff {
    _id: string;
    roomId: string;
    name: Field< string >;
    category: Field< string >;
    description: Field< string >;
    picture: Field< string >;
    price: Field< number >;
    toStuffInput(): StuffInput {
        return {
            _id: this._id,
            roomId: this.roomId,
            name: this.name.value,
            category: this.category.value,
            description: this.description.value,
            picture: this.picture.value,
            price: this.price.value
        }
    }
    constructor(stuff: Stuff, roomId?: string) {
        if( !stuff && !roomId ) throw 'please pass either Stuff or roomId as EditableStuff constructor arguments';
        this._id = stuff ? stuff._id : guid.v1();
        this.roomId = stuff && stuff.room ? stuff.room._id : roomId;
        this.name = new Field( stuff ? stuff.name : "", [C.nonEmpty()]);
        this.category = new Field( stuff ? stuff.category : "", [C.nonEmpty()] );
        this.description = new Field( stuff ? stuff.description : "", [C.nonEmpty()] );
        this.picture = new Field( stuff ? stuff.picture : "" );
        this.price = new Field( stuff ? stuff.price || 0 : 0 );
    }
    @mobx.computed get hasChanged() {
        return this.name.hasChanged ||
        this.category.hasChanged ||
        this.description.hasChanged ||
        this.picture.hasChanged ||
        this.price.hasChanged
    }
    @mobx.computed get isValid() {
        return this.name.isValid ||
        this.category.isValid ||
        this.description.isValid ||
        this.picture.isValid ||
        this.price.isValid
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