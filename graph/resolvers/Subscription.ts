import db from 'graph/IpfsApiStore';

const Logger = require('logplease');
const logger = Logger.create('subscription')

export default {
    watchOrders( root, {id}, store ) {
        return db.order.then( dborder => {
            logger.info('order:subscription');
            return dborder.query( o => o.roomId === id ) || [];
        } );
    },
    watchRooms( root, args, context ) {
        db.room.then( dbroom => dbroom.events.on('write', (dbname, hash, entry) => {
            logger('write:subscription ' + dbname, entry);
        } ) )
    }
}