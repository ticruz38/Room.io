import * as guid from 'node-uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';

import { Field, EditableRoom } from 'models';
import Loader from "graph/Loader";

const Document = require('./models.gql');

export class EditableUser {
    _id: string;
    @mobx.observable name: Field<string>
    email: Field<string>
    password: Field<string>
    confirmPassword: Field<string>
    picture: Field<string>
    @mobx.observable room?: EditableRoom
    constructor( user: User ) {
        this._id = user._id || guid.v1();
        this.name = new Field( user.name ||  "", [C.nonEmpty(), C.atLeast( 4 )] );
        this.email = new Field( user.email ||  "", [C.nonEmpty(), C.email()] );
        this.picture = new Field( user.picture || "" );
        this.password = new Field( user.password ||  "", [C.nonEmpty(), C.password()] );
        this.confirmPassword = new Field( "", [C.nonEmpty(), C.password(), C.sameAs( this.password )] );
        this.room = user.room ? new EditableRoom( user.room ) : null;
    }
    @mobx.computed get hasChanged(): boolean {
        return this.name.hasChanged ||
        this.email.hasChanged
    }
    @mobx.computed get isValid(): boolean {
        return (
            this.name.isValid ||
            this.email.isValid ||
            this.password.isValid
        )
    }
    toSignup(): Signup {
        return {
            _id: this._id,
            name: this.name.value,
            email: this.email.value,
            password: this.password.value
        };
    }
    toLogin(): Login {
        return {
            email: this.email.value,
            password: this.password.value
        };
    }
    toUserInput(): UserInput {
        return new UserInput(
            this.name.value,
            this.email.value,
            this.room ? this.room._id : undefined
        )
    }
    save(cb?: Function): void {
        Loader.execute( Document, 'SaveUser', { user: this.toUserInput } )
            .then( room => cb(room), error => console.log( error ) );
    }
    login(cb?: Function): void {
        Loader.execute( Document, 'Login', { user: this.toLogin } )
            .then( user => cb(user), error => console.log(error ) );
    }
    signup(cb?: Function): void {
        Loader.execute( Document, 'Signup')
    }
    delete(cb?: Function): void {
        Loader.execute( Document, 'DeleteUser', {id: this._id } )
            .then( room => cb(room), error => console.log( error ) );
    }
}

export class UserInput implements UserInput {
    _id: string = guid.v1();
    constructor(
        public name: string,
        public email: string,
        public roomId?: string,
        public picture?: string
    ) { }
}