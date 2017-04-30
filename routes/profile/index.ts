module.exports = {
  path: 'profile',

  getComponent(nextState, cb) {
    System.import('./Profile').then( module =>
        cb(null, module.default)
      ).catch(err => console.error(err) );
  }
}

