import db from '../../IpfsApiStore';

export default {
    rooms: function(root, params, context) {
        console.log('room resolver');
        return db.room.then( dbRoom => dbRoom.query( r => r.userId === root._id) || [] )
    }
}