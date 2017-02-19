import Stuff from './Stuff';
import Order from './Order';
import User from './User';

const Room = `
    type Room {
        _id: String!
        owner: User!
        name: String!
        description: String
        email: String
        phoneNumber: String
        picture: String
        categories: [String] # A room class its stuff under categories
        stuffs: [Stuff]
        orders: [Order]
    }
`;

export default () => [Room, Stuff, Order];