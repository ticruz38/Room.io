module.exports = {
    path: 'tables',
    getComponent(nextState, cb) {
        System.import('./Tables').then( module =>
            cb(null, module.default)
        ).catch(err => console.error(err));
    }
}