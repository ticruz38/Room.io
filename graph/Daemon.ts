const defaultOptions = require('./DefaultOptions').default;
const path = require('path')
import events = require('events');
const Logger = require('logplease')
const logger = Logger.create('ipfs-daemon', { useColors: false })
Logger.setLogLevel('ERROR')

class IpfsDaemon extends events.EventEmitter {
    static Name: string;

    types = { Buffer: Buffer };
    _daemon = null;
    _peerId = null;
    _options: ObjectLitteral;
    gatewayHost: any;
    getwayPort: string;
    apiHost: any;
    apiPort: string;

    constructor(options) {
        super()
        this._options = { ...defaultOptions, ...options };
        // quick fix to expose Buffer
        this._daemon = null
        this._peerId = null
    }

    get Options() {
        return this._options
    }

    get PeerId() {
        return this._peerId
    }

    get Addresses() {
        return {
            Gateway: (this.gatewayHost && this.gatewayPort) ? this.gatewayHost + ':' + this.gatewayPort + '/ipfs/' : null,
            API: (this.apiHost && this.apiPort) ? this.apiHost + ':' + this.apiPort : null
        }
    }

    get GatewayAddress() {
        return (this.gatewayHost && this.gatewayPort) ? this.gatewayHost + ':' + this.gatewayPort + '/ipfs/' : null
    }

    get APIAddress() {
        return (this.apiHost && this.apiPort) ? this.apiHost + ':' + this.apiPort : null
    }

    stop() {
        this._handleShutdown()
    }

    _handleShutdown() {
        logger.debug('Shutting down...')

        this._options = null
        this._daemon = null
        this._peerId = null

        logger.debug('IPFS daemon finished')
    }
}

IpfsDaemon.Name = 'ipfs-daemon'

export default Daemon;