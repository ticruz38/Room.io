import db from '../../IpfsApiStore';
import * as graphql from 'graphql';

export default {
    addRoom( root, {room}, context ) {
        db.room.then(dbroom => dbroom.put( room ).then( hash => {
            console.log('successfully added room', hash)
            //console.log('try to get room by id', db.room.get('coucou'))
            return room;
        }) );
        return room;
    },
    deleteRoom(root, {id}, context ) {
        console.log('deletemutation', id);
        db.room.then( dbroom => dbroom.del(id).then(removed => console.log('well removed', removed) ) )
    },
    updateRoom(root, {room}, context ) {
        return db.room.then( dbroom => dbroom.put( room ).then( hash => {
            console.log('successfully updated room', hash);
            //console.log('try to get room by id', db.room.get(hash))
            return room
        }));
    },
    addStuff(root, {stuff}, context ) {
        return db.stuff.then(dbStuff => dbStuff.put( stuff ).then( hash => {
            console.log('successfully added stuff', hash);
            //console.log('try to get room by id', db.room.get(hash))
            return stuff
        } ) );
    },
    updateStuff( root, {stuff} ) {
        return db.stuff.then(dbStuff => dbStuff.put( stuff ).then( hash => {
            console.log('successfully updated stuff', hash);
            //console.log('try to get stuff by id', db.stuff.get(hash))
            return stuff
        } ) );
    },
    // User Mutation
    signup(root, { user }, context: Storage) {
        console.log('signup', context);
        return db.user.then(dbUser => {
            return dbUser.put( user ).then( hash => {
                if( context ) context.setItem( 'user', JSON.stringify( user ) );
                console.log( 'correctly logged in as' + user.name );
                return user;
            } );
        } );
    },
    // Update User
    updateUser(root, { user }, context) {
        return db.user.then(dbUser => dbUser.put( user ).then( hash => {
            console.log('successfully updated user', hash);
            return user;
        } ) );
    }
}