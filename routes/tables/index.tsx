module.exports = {
  path: 'tables',
  getComponent(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./Tables').default)
    })
  }
}