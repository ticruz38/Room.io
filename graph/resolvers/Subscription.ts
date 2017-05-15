import db from '../IpfsApiStore';

const Logger = require('logplease');
const logger = Logger.create('subscription')

export default {
    watchOrders(root, { id }, store) {
        db.orderWatch.then(dborder => {
            const query = () => dborder.query(o => o.roomId === id) || [];
            dborder.events.on('write', (dbname) => {
                logger.info('order:subscription:write', dbname);
                store.orders = query();
            })
            dborder.events.on('synced', (dbname) => {
                store.orders = query();
            })
            store.orders = query();
        });
    },
    // context here is the component state
    watchRooms(root, args, context) {
        db.roomWatch.then(dbroom => {
            const query = () => dbroom.query(doc => !!doc);
            dbroom.events.on('write', (dbname) => {
                logger.info('watchRoom:subscription:write', dbname);
                context.rooms = query();
            })
            dbroom.events.on('synced', (dbname) => { // paralel loading
                logger.info('watchRoom:subscription:synced', dbname);
                context.rooms = query();
            })
            context.rooms = query();
        })
    }
}