module.exports = {
  getComponent(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./Layout').default)
    })
  }
}