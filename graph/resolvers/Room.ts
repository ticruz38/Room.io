import db from 'graph/IpfsApiStore';

export default {
    stuffs: function(root, params, context ) {
        return db.stuff.then( dbStuff => dbStuff.query( s => s._id === root._id ) || [] )
    }
};