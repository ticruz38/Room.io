import RoomInput from './RoomInput';
import StuffInput from './StuffInput';
import Room from '../query/Room';
import Stuff from '../query/Stuff';

const Mutation = `
    type Mutation {
        addRoom(room: RoomInput): Room
        deleteRoom(id: String!): Room
        updateRoom(roomID: String!, room: RoomInput!): Room
        addStuff(roomID: String!): Stuff
        updateStuff(stuffID: String!, stuff: StuffInput!): Stuff
    }
`;

export default () => [RoomInput, StuffInput, Room, Stuff, Mutation];