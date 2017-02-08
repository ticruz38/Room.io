module.exports = {
  path: 'room',

  getComponent(nextState, cb) {
    require.ensure([], function(require) {
      cb(null, require('./Room'))
    })
  }
}