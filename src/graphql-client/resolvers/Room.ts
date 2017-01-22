import db from '../../IpfsApiStore';

export default {
    stuffs: function(root, {}, context ) {
        console.log(root);
        return db.stuff.then( dbStuff => dbStuff.query( s => s._id === root._id ) )
    }
};