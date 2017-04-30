module.exports = {
    path: ':roomId',

    getChildRoutes(partialNextState, cb) {
        System.import('./Order').then( module =>
            cb(null, module.default)
        ).catch(err => console.error(err) );
    },

    getIndexRoute(nextState, cb) {
        System.import('./RoomContent').then( module =>
            cb(null, module.default)
        ).catch(err => console.error(err));
    },

    getComponent(nextState, cb) {
        System.import('./FullScreenRoom').then( module =>
            cb(null, module.default)
        ).catch(err => console.error(err) );
    }
}