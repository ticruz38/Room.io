module.exports = {
  path: 'profile',

  getComponent(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./Profile').default)
    })
  }
}