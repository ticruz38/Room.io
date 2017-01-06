import db from '../../IpfsApiStore';


export default {
    room( id: string ) {
        console.log('getRoom');
        return db.room.get(id);
    },
    rooms() {
        console.log('getRooms')
        return db.room.query(doc => doc );
    },
}