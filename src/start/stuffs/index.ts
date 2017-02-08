module.exports = {
  path: '/',

  getComponent(nextState, cb) {
    require.ensure([], function(require) {
      cb(null, require('./Stuffs'))
    })
  }
}