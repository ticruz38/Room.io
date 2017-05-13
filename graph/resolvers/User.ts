import db from '../IpfsApiStore';



export default {
  room: function (root, params, context) {
    console.log('room resolver', root);
    return db.room.then(dbRoom => dbRoom.query(r => r.userId === root._id)[0]);
  }
}