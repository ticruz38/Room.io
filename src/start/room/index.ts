module.exports = {
  path: 'room',

  getComponent(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./Room').default)
    })
  }
}