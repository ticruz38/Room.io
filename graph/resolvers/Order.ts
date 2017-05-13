import db from '../IpfsApiStore';

export default {
    stuffs: function ( root: OrderInput, params, context ) {
        return db.stuff.then( dbStuff => root.stuffIds.map( sId => dbStuff.get(sId)[0] ) );
    },
    client: function ( root: OrderInput, params, context ) {
        return db.user.then( dbUser => dbUser.query( u => u._id === root.clientId )[0] );
    }
}