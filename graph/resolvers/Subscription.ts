import db from 'graph/IpfsApiStore';

const Logger = require('logplease');
const logger = Logger.create('subscription')

export default {
    watchOrders(root, { id }, store) {
        return db.order.then(dborder => {
            logger.info('order:subscription');
            return dborder.query(o => o.roomId === id) || [];
        });
    },
    // context here is the component state
    watchRooms(root, args, context) {
        db.room.then(dbroom => {
            const query = () => dbroom.query(doc => !!doc);
            dbroom.events.on('write', (dbname, hash, entry) => {
                logger.info('watchRoom:subscription:write', dbname, hash, entry);
                context.rooms = query();
            })
            dbroom.events.on('synced', (dbname, hash, entry) => {
                logger.info('watchRoom:subscription:synced', dbname, hash, entry);
                context.rooms = query();
            })
            context.rooms = query();
        })
    }
}