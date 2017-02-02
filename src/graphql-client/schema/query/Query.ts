import Room from './Room';
import User from './User';

const Query = `
    type Query {
        room(id: String): Room
        rooms: [Room]
        user(id: String): User
        login(name: String, password: String): User
    }
`
export default () => [Room, User, Query];
