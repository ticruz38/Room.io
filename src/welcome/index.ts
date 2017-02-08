module.exports = {
  path: 'welcome',

  getComponent(nextState, cb) {
    require.ensure([], function(require: NodeRequire) {
      cb(null, require('./Welcome').default)
    })
  }
}