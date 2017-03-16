import * as guid from 'node-uuid';
import * as mobx from 'mobx';
import * as C from 'components/form/Constraint';

import { Field, EditableRoom } from 'models';
import Loader from "graph/Loader";
import Editable from "models/Editable";

const Document = require('./models.gql');

export class EditableUser extends Editable {
    _id: string;
    @mobx.observable name: Field<string>
    email: Field<string>
    password: Field<string>
    confirmPassword: Field<string>
    picture: Field<string>
    @mobx.observable room?: EditableRoom
    constructor( user: User ) {
        super();
        this._id = user._id || guid.v1();
        this.name = new Field( user.name ||  "", [C.nonEmpty(), C.atLeast( 4 )] );
        this.email = new Field( user.email ||  "", [C.nonEmpty(), C.email()] );
        this.picture = new Field( user.picture || "" );
        this.password = new Field( user.password ||  "", [C.nonEmpty(), C.password()] );
        this.confirmPassword = new Field( "", [C.nonEmpty(), C.password(), C.sameAs( this.password )] );
        this.room = user.room ? new EditableRoom( user.room ) : null;
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
    save = (cb?: Function) => this.execute( 'SaveUser', { user: this.toInput() }, cb )
    login = (cb?: Function) => this.execute( 'Login', { login: this.toLogin() }, cb )
    signup = (cb?: Function ) => this.execute( 'Signup', { user: this.toSignup() }, cb )
    delete = (cb?: Function ) => this.execute( 'DeleteUser', { id: this._id }, cb )
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