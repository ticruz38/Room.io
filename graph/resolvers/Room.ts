import db from 'graph/IpfsApiStore';

export default {
  owner: function (root, params, context) {
    return db.user.then( dbUser => dbUser.query(u => u.roomId === root._id) )
  },
  stuffs: function (root, params, context) {
    return db.stuff.then(dbStuff => dbStuff.query(s => s.roomId === root._id) || [] )
  },
  orders: function (root, params, context) {
    return db.order.then(dbOrder => dbOrder.query(o => o.roomId === root._id ) || [] )
  }
};