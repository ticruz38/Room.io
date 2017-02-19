import db from 'graph/IpfsApiStore';

export default {
    room: function(root, args, context) {
        return db.room.then(dbRoom => dbRoom.query( r => r.roomId === root._id ) || [] )
    }
};