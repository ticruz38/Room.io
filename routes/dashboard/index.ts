module.exports = {
    path: 'dashboard',
    getComponent(nextState, cb) {
        System.import('./Dashboard').then( module =>
            cb(null, module.default)
        ).catch(err => console.error(err));
    }
}