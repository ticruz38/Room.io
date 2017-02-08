module.exports = {
  path: 'welcome',

  getComponent(nextState, cb) {
    require.ensure([], function(require) {
      cb(null, require('./Welcome'))
    })
  }
}