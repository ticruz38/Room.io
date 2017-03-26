import db from 'graph/IpfsApiStore';

export default {
    stuffs: function ( root: OrderInput, params, context ) {
        console.log('order resolver: stuffs', root);
        return db.stuff.then( dbStuff => dbStuff.query( s => root.stuffIds.some( sId => sId === s._id ) ) );
    },
    client: function ( root: OrderInput, params, context ) {
        console.log('order resolver: client', root);
        return db.user.then( dbUser => dbUser.query( u => u._id === root.clientId )[0] );
    }
}