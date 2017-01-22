import RoomInput from './RoomInput';
import StuffInput from './StuffInput';
import Room from '../query/Room';
import Stuff from '../query/Stuff';

const Mutation = `
    type Mutation {
        addRoom(room: RoomInput): Room
        updateRoom(room: RoomInput!): Room
        deleteRoom(id: String!): Room
        addStuff(stuff: StuffInput): Stuff
        updateStuff(stuff: StuffInput!): Stuff
    }
`;

export default () => [RoomInput, StuffInput, Room, Stuff, Mutation];