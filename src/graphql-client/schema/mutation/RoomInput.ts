import StuffInput from './StuffInput';


const RoomInput = `
    input RoomInput {
        _id: String!
        name: String! # Room Name
        description: String # Room Description
        stuffs: [StuffInput]  
        pictures: [String] # Room pictures as a list of hash
    }
`;

export default () => [StuffInput, RoomInput];
