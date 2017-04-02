import db from 'graph/IpfsApiStore';


const Logger = require('logplease');

const logger = Logger.create('subscription')

export default {
    watchOrders( root, {id}, context ) {
        db.order.then( dborder => dborder.events.on('write', (dbname, hash, entry) => {
            logger('write:subscription ' + dbname, entry);
        } ) )
    },
    watchRooms( root, args, context ) {
        db.room.then( dbroom => dbroom.events.on('write', (dbname, hash, entry) => {
            logger('write:subscription ' + dbname, entry);
        } ) )
    }
}