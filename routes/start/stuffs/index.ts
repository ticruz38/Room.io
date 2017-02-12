module.exports = {
  path: 'stuffs',

  getComponent(nextState, cb) {
    require.ensure([], function(require) {
      cb(null, require('./Stuffs'))
    })
  }
}