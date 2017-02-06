import StuffInput from './StuffInput';


const RoomInput = `
    input RoomInput {
        _id: String!
        userId: String!
        name: String! # Room Name
        description: String # Room Description
        email: String,
        phoneNumber: String,
        picture: String # Room pictures as a list of hash
        stuffs: [StuffInput]
    }
`;

export default () => [StuffInput, RoomInput];
