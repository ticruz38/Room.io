module.exports = {
  path: ':roomId',

  getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require: NodeRequire) {
      callback(null, [
        require('./Order').default
      ])
    })
  },

  getIndexRoute(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./RoomContent').default)
    })
  },

  getComponent(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./FullscreenRoom').default)
    })
  }
}