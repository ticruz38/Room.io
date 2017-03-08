import * as guid from 'node-uuid';
import * as mobx from 'mobx';

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

export class UserInput implements UserInput {
    _id: string
    constructor(
        public name: string,
        public email: string,
        public password: string
    ) {
        this._id = guid.v1();
    }
}

export class Field implements Field {
    @mobx.observable value: any;
    @mobx.observable isValid: boolean;
    constructor(
        value: any,
        public constraints: Function[] = [],
        isValid: boolean = false
    ) {}
}