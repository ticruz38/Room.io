module.exports = {
  path: '/',

  /*getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('../rooms'),
        require('../profile'),
        require('../start'),
      ])
    })
  },*/

  getComponent(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./RoomFeed').default)
    })
  }
}