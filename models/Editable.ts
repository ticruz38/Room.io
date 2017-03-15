import Loader from 'graph/Loader';
import * as mobx from 'mobx';

const Document = require('./models.gql');


export default class Editable {
    resetChange = () => Object.keys(this).map( key => this[key].hasChanged ? this[key].hasChanged = false : '' );

    toInput = (): any => {
        const input: any = {}
        Object.keys(this).filter( key => typeof this[key] !== 'function' ).map( key => this[key].value !== undefined ? input[key] = this[key].value : input[key] = this[key] )
        return input;
    }

    execute = ( operation: string, variables: Object, cb?: Function ) =>
        Loader.execute( Document, operation, variables )
            .then( result => {
                this.resetChange();
                cb ? cb(result) : result 
            }, error => { throw error } )

    @mobx.computed get hasChanged() {
        return Object.keys(this).some( key => !!this[key].hasChanged )
    }
    @mobx.computed get isValid() {
        return Object.keys(this).some( key => !!this[key].isValid )
    }
}