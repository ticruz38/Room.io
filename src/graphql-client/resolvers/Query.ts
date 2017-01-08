import db from '../../IpfsApiStore';

export default {
    room( id: string ) {
        return db.room.then( room => room.get(id) );
    },
    rooms(root, args, context) {
        console.log('getrooms');
        // each docStore are a promise, resolved when data are loaded 
        const all = db.room.then(room => room.query( doc => !!doc ) );
        console.log('getrooms', all);
        return all;
    }
}