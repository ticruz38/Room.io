import db from '../../IpfsApiStore';


export default {
    room( id: string ) {
        return db.room.get(id);
    },
    rooms() {
        return db.room.query(doc => doc );
    },
}