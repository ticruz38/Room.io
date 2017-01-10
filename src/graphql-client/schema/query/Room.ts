import Stuff from './Stuff';

const Room = `
    type Room {
        _id: String!
        name: String!
        description: String
        stuffs: [Stuff]
        pictures: [String]
    }
`;

export default () => [Room, Stuff];