import db from 'graph/IpfsApiStore';

export default {
    room: function(root, args, context) {
        return db.room.then(dbRoom => dbRoom.query( r => r._id === root.roomId )[0] || [] )
    }
};