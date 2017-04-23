import db from 'graph/IpfsApiStore';

const Logger = require('logplease');
Logger.setLogLevel('INFO');
const logger = Logger.create('Stuff:Resolver');

export default {
    room: function ( root, params, context ) {
        // logger.info("resolving stuff");
        return db.room.then( dbRoom => dbRoom.query( r => r._id === root.roomId )[0] )
    }
};