declare type Field = {
    value: any;
    constraints: Function[];
    isValid: boolean;
}

declare type ObjectLitteral = {[prop: string]: string}

declare interface User {
    _id: String
    name: String
    email?: String
    password?: String
    rooms?: String[]
}

declare interface Stuff {
    _id?: String
    roomId: String
    name: String
    description?: String
    picture?: String
    price?: Number
}

declare interface Room {
    _id: String
    userId: String
    name: String
    description: String
    email: String
    phoneNumber: String
    picture: String
    stuffs: Stuff[]
}

interface NodeRequire {
   ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
}