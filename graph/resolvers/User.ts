import db from 'graph/IpfsApiStore';
import { debug } from 'graph/resolvers';



export default {
  rooms: function (root, params, context) {
    console.log('room resolver', root);
    return db.room.then(dbRoom => dbRoom.query(r => r.userId === root._id));
  }
}