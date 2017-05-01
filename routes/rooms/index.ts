module.exports = {
    path: 'rooms',

    childRoutes: [
        require('./fullscreenRoom')
    ],

    getComponent(nextState, cb) {
        System.import('./RoomFeed').then( module =>
            cb(null, module.default)
        ).catch(err => console.error(err));
    }
}