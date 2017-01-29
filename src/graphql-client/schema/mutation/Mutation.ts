import RoomInput from './RoomInput';
import StuffInput from './StuffInput';
import UserInput from './UserInput';
import Room from '../query/Room';
import Stuff from '../query/Stuff';
import User from '../query/User';

const Mutation = `
    type Mutation {
        addRoom(room: RoomInput!): Room
        updateRoom(room: RoomInput!): Room
        deleteRoom(id: String!): Room
        addStuff(stuff: StuffInput!): Stuff
        updateStuff(stuff: StuffInput!): Stuff
        signup(user: UserInput!): User # has to be handled via ethereum for security
        updateUser(user: UserInput!): User # has to be handled via ethereum for security
    }
`;

export default () => [RoomInput, StuffInput, UserInput, Room, Stuff, User, Mutation];