import db from '../../IpfsApiStore';

export default {
    room(root, args, context) {
        return db.room.then( roomDb => roomDb.get(args.id)[0] );
    },
    rooms(root, args, context) {
        // each docStore are a promise, resolved when data are loaded 
        const all = db.room.then(roomDb => {console.log('room:ready'); return roomDb.query( doc => !!doc )} );
        console.log('roomsQuery:Resolver', db.room);
        //return all.map(room => room.pictures ? room.pictures : [];
        return all;
    },
    user(root, args, context) {
        return db.user.then( userDb => userDb.get(args.id) );
    }
}