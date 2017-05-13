// import * as Orbitdb from './orbit-db';
declare interface Field {
  value: any;
  constraints: Function[];
  isValid: boolean;
  hasChanged: boolean;
}
declare module "*.json" {
    const value: any;
    export default value;
}

declare type ObjectLitteral = { [prop: string]: string }

declare interface User {
  _id?: string
  name?: string
  email?: string
  picture?: string;
  password?: string
  room?: Room
}

// this one is used to interact with user data inside the app
declare interface UserInput {
    _id: string
    name: string
    email: string
    password: string
    roomId: string
}

// this one is used for signup and login
declare interface Signup {
    _id: string
    name: string
    email: string
    password: string
}

declare interface Login {
    email: string
    password: string
}

declare interface Stuff {
  _id?: string
  room?: Room
  name?: string
  category?: string
  description?: string
  picture?: string
  price?: number
}

declare interface StuffInput {
    _id: string
    roomId: string
    name: string
    category: string
    description?: string
    picture?: string
    price?: number
}

declare interface Room {
  _id?: string
  owner?: User
  name?: string
  description?: string
  email?: string
  phoneNumber?: string
  picture?: string
  stuffs?: Stuff[]
  orders?: Order[]
  tags?: string[]
}

declare interface RoomInput {
    _id: string
    userId: string
    name: string
    description?: string
    email?: string,
    phoneNumber?: string,
    picture?: string,
    tags?: string[]
}

declare interface Order {
  _id: string
  stuffs: Stuff[]
  room: Room
  client: User
  message: string
  payed: boolean
  treated: boolean
  created: number
  amount: number
}

declare interface OrderInput {
    _id: string
    clientId: string
    roomId: string
    stuffIds: string[]
    message: string
    payed: boolean
    amount: number
}

declare type ExecuteParams = {
  rootValue?: Object
  contextValue?: any
  variables?: Object
  cb?: (data: Object, context: any) => void
}

interface NodeRequire {
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
}

declare const System: any;