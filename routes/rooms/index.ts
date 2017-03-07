module.exports = {
  path: 'rooms',

  getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('./fullscreenRoom'),
      ])
    })
  },

  getComponent(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./RoomFeed').default)
    })
  }
}