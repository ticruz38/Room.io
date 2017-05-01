import Ipfs from 'ipfs';
import PubSub from 'ipfs-pubsub';

const Orbitdb = require('orbit-db');
// set up a guardian node, that will listen to write event and update it's collection object in it's repo
// and provide other node with the most up to date collections

