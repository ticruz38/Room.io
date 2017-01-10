import db from '../../IpfsApiStore';

export default {
    room( id: string ) {
        return db.room.then( room => room.get(id) );
    },
    rooms(root, args, context) {
        // each docStore are a promise, resolved when data are loaded 
        const all = db.room.then(room => room.query( doc => !!doc ) );
        return all;
    }
}