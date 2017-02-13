module.exports = {
  path: 'dashboard',
  getComponent(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./Dashboard').default)
    })
  }
}