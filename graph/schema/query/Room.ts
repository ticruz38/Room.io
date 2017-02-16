import Stuff from './Stuff';
import Order from './Order';

const Room = `
    type Room {
        _id: String!
        userId: String!
        name: String!
        description: String
        email: String
        phoneNumber: String
        picture: String
        stuffs: [Stuff]
        orders: [Order]
    }
`;

export default () => [Room, Stuff, Order];