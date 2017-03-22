import User from './User';
import Room from './Room';
import Stuff from './Stuff';

const Order = `
    type Order {
        _id: String!
        stuffs: [Stuff]! # Which stuffs does that order points to
        room: Room!
        client: User
        message: String # Additional message the customer has put on its order
        payed: Boolean
        treated: Float # Date in unix
        created: Float # Date in unix
        amount: Float
    }
`

export default () => [Stuff, Room, User, Order];