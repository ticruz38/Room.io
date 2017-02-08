module.exports = {
  path: 'profile',

  /*getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('../rooms'),
        require('../profile'),
        require('../start'),
      ])
    })
  },*/

  getComponent(nextState, cb) {
    require.ensure([], function(require) {
      cb(null, require('./Profile'))
    })
  }
}