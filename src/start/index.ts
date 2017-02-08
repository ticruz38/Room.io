module.exports = {
  path: 'start',

  getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('./stuffs'),
        require('./room')
      ])
    })
  }
}