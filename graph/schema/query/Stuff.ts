import Room from './Room';

const Stuff = `
    type Stuff {
        _id: String!
        room: Room!
        name: String!
        category: String
        description: String
        picture: String
        price: Float
    }
`;

export default () => [Stuff, Room];