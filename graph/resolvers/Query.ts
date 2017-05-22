import db from '../IpfsApiStore';
import { GraphQLError } from 'graphql';
import { uniq } from '../utils';

export default {
    room( root, args, context ) {
        return db.room.then( roomDb => roomDb.get( args.id )[0] );
    },
    rooms( root, args, context ) {
        // each docStore are a promise, resolved when data are loaded 
        return db.room.then( roomDb => {
            return roomDb.query( doc => !!doc );
        } );
    },
    user( root, args, context ) {
        return db.user.then( userDb => userDb.query( u => u._id === args.id )[0] );
    },
    login( root, { login }, context ) {
        return new Promise(( resolve, reject ) => {
            db.user.then( userDb => {
                const user = userDb.get( login.email )[0];
                console.log(user);
                if ( !user ) return reject( new GraphQLError( login.email + ' is not registered in the network' ) );
                return user.password === login.password ? 
                    resolve( user ) : 
                    reject( new GraphQLError( 'The password do not match the email' ) )
            } );
        } );
    },
    tags: function( root, params, context ) {
        return db.room.then( dbRoom => {
            const rooms = dbRoom.query( r => !!r );
            return uniq( rooms.reduce( (acc, cur) => 
                [...acc, ...(cur.tags || []) ]
            , [] ) )
        } )
    },
}