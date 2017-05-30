import db from '../IpfsApiStore';
import * as moment from 'moment';
import { addressStamp } from '../utils';
const Logger = require('logplease');
Logger.setLogLevel('INFO');
const logger = Logger.create('mutation');

export default {
    addOrder(root, { order }, context) {
        logger.info("adding order");
        order.created = moment().unix();
        addressStamp(order);
        return db.order.then(dborder => dborder.put(order).then(hash => {
            logger.info('successfully added order', hash);
            dborder.events.emit('addOrder', { order: order });
            return order
        }));
    },
    deleteOrder(root, { id }, context) {
        logger.info('deleting order', id);
        db.order.then(dborder => dborder.del(id)
            .then(removed => {
                logger.info('well removed', removed)
                return removed;
            }))
    },
    updateOrder(root, { order }, context) {
        logger.info('updating order', order._id);
        return db.order.then(dborder => dborder.put(order).then(hash => {
            logger.info('successfully updated order', hash);
            dborder.events.emit('updateOrder', { order: order });
            logger.info('Emitting updateOrder');
            return order
        }));
    },
    addRoom(root, { room }, context) {
        logger.info("adding room");
        addressStamp(room);
        return db.room.then(dbroom => dbroom.put(room).then(hash => {
            logger.info('successfully added room', hash)
            return room;
        }));
    },
    deleteRoom(root, { id }, context) {
        logger.info('deleting room', id);
        return db.room.then(dbroom => dbroom.del(id)
            .then(removed => {
                logger.info('well removed', removed)
                return removed;
            }))
    },
    updateRoom(root, { room }, context) {
        return db.room.then(dbroom => dbroom.put(room).then(hash => {
            //logger.info('try to get room by id', db.room.get(hash))
            return room
        }));
    },
    addStuff(root, { stuff }, context) {
        addressStamp(stuff);
        return db.stuff.then(dbStuff => dbStuff.put(stuff).then(hash => {
            //logger.info('try to get room by id', db.room.get(hash))
            return stuff
        }));
    },
    deleteStuff(root, { id }, context) {
        return db.stuff.then(dbStuff => dbStuff.del(id)
            .then(removed => {
                logger.info('well removed', removed);
                return removed;
            })
        )
    },
    updateStuff(root, { stuff }) {
        return db.stuff.then(dbStuff => dbStuff.put(stuff).then(hash => {
            logger.info('successfully updated stuff', hash);
            //logger.info('try to get stuff by id', db.stuff.get(hash))
            return stuff
        }));
    },
    // User Mutation
    signup(root, { user }, context: Storage) {
        addressStamp(user);
        return db.user.then(dbUser => {
            return dbUser.put(user).then(hash => {
                if (context) context.setItem('user', JSON.stringify(user));
                logger.info('correctly logged in as' + user.name);
                return user;
            });
        });
    },
    logWithUport( root, { user }, context ) {
        console.log('logwithuport', user);
        return db.user.then( userDb => {
            const userExist = userDb.get( user.email )[0];
            if(!userExist) {
                // if not add it to the app
                userDb.put(user);
                return user;
            }
            return userDb.query( u => u._id === user._id)[0];
        })
    },
    deleteUser(root, { id }, context) {
        return db.user.then(dbUser => dbUser.del(id)
            .then(removed => {
                logger.info('well removed', removed);
                return removed;
            })
        )
    },
    // Update User
    updateUser(root, { user }, context) {
        return db.user.then(dbUser => {
            const oldUser = dbUser.query(u => u._id === user._id)[0];
            user.password = oldUser.password;
            dbUser.put(user).then(hash => {
                logger.info('successfully updated user', hash);
                return user;
            })
        });
    }
}