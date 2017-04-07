const Orbitdb = require("orbit-db");
const repoPath = String(Math.random());
const Logger = require('logplease');
const logger = Logger.create("Ipfs-server");

const node = new Ipfs({
    repo: repoPath,
    init: false,
    start: false,
    EXPERIMENTAL: {
        pubsub: true
    }
});

const orbitdb = new Orbitdb(node);

export default new Promise((resolve, reject) => {
    node.init({ emptyRepo: true, bits: 2048 }, function(err) {
        if (err) {
            throw err;
        }
        node.start(function(err) {
            if (err) {
                throw err;
            }
            logger.info("Starting IPFS daemon");
            node.goOnline(err => {
                if (err) return reject(err);

                node.id((err, id) => {
                    if (err) {
                        logger.error(err);
                        return reject(err);
                    }
                    // Assign the IPFS api to this
                    logger.info("IPFS daemon started");
                    resolve( orbitdb );
                });
            });
        });
    });
});
