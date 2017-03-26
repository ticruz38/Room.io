import db from 'graph/IpfsApiStore';

export default {
    stuffs: function ( root: OrderInput, params, context ) {
        console.log('order resolver: stuffs', root);
        return db.stuff.then( dbStuff => dbStuff.query( s => root.stuffIds.some( sId => sId === s._id ) ) )
    }
}