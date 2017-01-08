import Room from './Room';

const Query = `
    type Query {
        room(id: String): Room
        rooms: [Room]
    }
`
export default () => [Room, Query];
