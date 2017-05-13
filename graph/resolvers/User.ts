import db from '../IpfsApiStore';

export default {
  room: function (root, params, context) {
    return db.room.then(dbRoom => dbRoom.query(r => r.userId === root._id)[0]);
  }
}