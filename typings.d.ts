declare interface Field {
  value: any;
  constraints: Function[];
  isValid: boolean;
}

declare type ObjectLitteral = { [prop: string]: string }

declare interface User {
  _id: string
  name: string
  email?: string
  password?: string
  room: Room
}

declare interface Stuff {
  _id?: string
  room: Room
  name: string
  category?: string
  description?: string
  picture?: string
  price?: number
}

declare interface Room {
  _id: string
  owner: User
  name: string
  description: string
  email: string
  phoneNumber: string
  picture: string
  categories: string[]
  stuffs: Stuff[]
  orders: Order[]
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

declare type ExecuteParams = {
  rootValue?: Object
  contextValue?: any
  variables?: Object
  cb?: (data: Object, context: any) => void
}

interface NodeRequire {
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
}