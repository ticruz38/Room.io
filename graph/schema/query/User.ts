import Room from './Room';

const User =  `
    type User {
        _id: String!
        name: String
        email: String!
        picture: String
        password: String! #hash256 password
        room: Room #user rooms listed by Id
    }
    input UserLogin {
        email: String!
        password: String!
    }
`;

export default () => [User, Room];
