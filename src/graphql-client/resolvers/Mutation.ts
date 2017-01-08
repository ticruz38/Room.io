import db from '../../IpfsApiStore';

export default {
    addRoom: function( root, {room}, context ) {
        room._id = 'coucou';
        console.log(room);
        db.room.put( room ).then( hash => {
            console.log('successfully added room', hash)
            console.log('try to get room by id', db.room.get('coucou'))
            return room;
        });
        return room;
    },
    deleteRoom: function(root, args, context ) {
        console.log('deletemutation', args.id);
        db.room.del('undefined').then(removed => console.log('well removed', removed) )
    },
    updateRoom: function( roomID: string, room: any ) {
        room._id = roomID;
        console.log('see if room got an id', room);
        return db.room.put( room ).then( hash => {
            console.log('successfully updated room', hash)
            console.log('try to get room by id', db.room.get(hash))
            return room
        });
    },
    addStuff: function( stuff: any ) {
        return db.stuffs.put( stuff ).then( hash => {
            console.log('successfully added room', hash)
            console.log('try to get room by id', db.room.get(hash))
            return stuff
        });
    },
    updateStuff: function( stuffID: string, stuff: any) {
        stuff._id = stuffID;
        console.log('see if stuff got an id', stuff);
        return db.stuffs.put( stuff ).then( hash => {
            console.log('successfully updated stuff', hash)
            console.log('try to get stuff by id', db.stuffs.get(hash))
            return stuff
        });
    }
}