import Stuff from './Stuff';

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
    }
`;

export default () => [Room, Stuff];