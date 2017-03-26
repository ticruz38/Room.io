import db from 'graph/IpfsApiStore';
import * as graphql from 'graphql';
import * as moment from 'moment';

const Logger = require('logplease');
Logger.setLogLevel('INFO');
const logger = Logger.create('mutation');

export default {
    addOrder( root, {order}, context ) {
        logger.info("adding order");
        db.order.then(dborder => dborder.put( order ).then( hash => {
            logger.info('successfully added order', hash);
            return order
        } ) );
        return order;
    },
    deleteOrder(root, {id}, context ) {
        logger.info('deleting order', id);
        db.order.then( dborder => dborder.del(id)
            .then(removed => {
                logger.info('well removed', removed)
                return removed;
            } ) )
    },
    updateOrder(root, {order}, context ) {
        logger.info('updating order', order._id);
        order.created = moment().unix();
        console.log(order);
        return db.order.then( dborder => dborder.put( order ).then( hash => {
            logger.info('successfully updated order', hash);
            //logger.info('try to get order by id', db.order.get(hash))
            return order
        }));
    },
    addRoom( root, {room}, context ) {
        logger.info("adding room");
        db.room.then(dbroom => dbroom.put( room ).then( hash => {
            logger.info('successfully added room', hash)
            //logger.info('try to get room by id', db.room.get('coucou'))
            return room;
        }) );
        return room;
    },
    deleteRoom(root, {id}, context ) {
        logger.info('deleting room', id);
        db.room.then( dbroom => dbroom.del(id)
            .then(removed => {
                logger.info('well removed', removed)
                return removed;
            } ) )
    },
    updateRoom(root, {room}, context ) {
        return db.room.then( dbroom => dbroom.put( room ).then( hash => {
            //logger.info('successfully updated room', hash);
            //logger.info('try to get room by id', db.room.get(hash))
            return room
        }));
    },
    addStuff(root, {stuff}, context ) {
        return db.stuff.then(dbStuff => dbStuff.put( stuff ).then( hash => {
            //logger.info('try to get room by id', db.room.get(hash))
            return stuff
        } ) );
    },
    deleteStuff( root, {id}, context) {
        db.stuff.then( dbStuff => dbStuff.del(id)
            .then(removed => {
                logger.info('well removed', removed);
                return removed;
            } ) 
        )
    },
    updateStuff( root, {stuff} ) {
        return db.stuff.then(dbStuff => dbStuff.put( stuff ).then( hash => {
            logger.info('successfully updated stuff', hash);
            //logger.info('try to get stuff by id', db.stuff.get(hash))
            return stuff
        } ) );
    },
    // User Mutation
    signup(root, { user }, context: Storage) {
        return db.user.then(dbUser => {
            return dbUser.put( user ).then( hash => {
                if( context ) context.setItem( 'user', JSON.stringify( user ) );
                logger.info( 'correctly logged in as' + user.name );
                return user;
            } );
        } );
    },
    deleteUser( root, { id }, context ) {
        db.user.then( dbUser => dbUser.del(id)
            .then(removed => {
                logger.info('well removed', removed);
                return removed;
            } )
        )
    },
    // Update User
    updateUser(root, { user }, context) {
        return db.user.then( dbUser => dbUser.put( user ).then( hash => {
            logger.info('successfully updated user', hash);
            return user;
        } ) );
    }
}