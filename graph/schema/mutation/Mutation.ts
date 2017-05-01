import RoomInput from './RoomInput';
import StuffInput from './StuffInput';
import UserInput from './UserInput';
import OrderInput from './OrderInput';
import Room from '../query/Room';
import Stuff from '../query/Stuff';
import User from '../query/User';
import Order from '../query/Order';

const Mutation = `
    type Mutation {
        addOrder(order: OrderInput!): Order
        updateOrder(order: OrderInput!): Order
        deleteOrder(id: String!): Order

        addRoom(room: RoomInput!): Room
        updateRoom(room: RoomInput!): Room
        deleteRoom(id: String!): Room

        addStuff(stuff: StuffInput!): Stuff
        updateStuff(stuff: StuffInput!): Stuff
        deleteStuff(id: String!): Stuff

        signup(user: UserSignup!): User # has to be handled via ethereum for security
        updateUser(user: UserInput!): User # has to be handled via ethereum for security
        deleteUser(id: String!): User
    }
`;

export default () => [
    RoomInput, 
    StuffInput, 
    UserInput, 
    OrderInput, 
    Room, 
    Stuff, 
    User, 
    Order, 
    Mutation
];