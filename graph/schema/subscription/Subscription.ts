
import Order from '../query/Order';
import Room from '../query/Room';



const Subscription = `
    type Subscription {
        watchOrders(id: String!): [Order]
        watchRooms: [Room]
    }
`;

export default () => [
    Room,
    Order,
    Subscription
];
