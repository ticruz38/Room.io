import Loader from 'graph/Loader';
import * as mobx from 'mobx';

const Document = require('./models.gql');


export default class Editable {
    resetChange = () => Object.keys(this).map( key => this[key] && this[key].hasChanged ? this[key].hasChanged = false : '' );

    toInput = (): any => {
        const input: any = {}
        console.log(this);
        Object.keys(this)
            .filter( key => ( //filter editable entry to generate an input
                typeof this[key] !== 'function' &&
                !(typeof this[key] !== 'string' && this[key].length !== undefined && typeof this[key][0] !== 'string' ) &&
                key !== 'confirmPassword' &&
                !(this[key] instanceof Editable) ) )
            .map( key => this[key].value !== undefined ? input[key] = this[key].value : input[key] = this[key] )
        console.log(input);
        return input;
    }

    execute = ( operation: string, variables: Object, cb?: Function ) =>
        Loader.execute( Document, operation, variables )
            .then( result => {
                console.log('result for ' + operation, result );
                this.resetChange();
                cb ? cb(result) : result 
            }, error => { throw error } )
    @mobx.computed get hasChanged() {
        console.log('hasChanged');
        return Object.keys(this).filter( key => ( !( this[key] instanceof Editable ) ) ).some( key => !!(this[key] && this[key].hasChanged) )
    }
    @mobx.computed get isValid() {
        console.log('isValid', Object.keys(this).map( key => ( this[key].isValid ) ) );
        return !Object.keys(this).some( key => ( 
            this[key] &&
            this[key].isValid !== undefined &&
            !(this[key] instanceof Editable) &&
            !this[key].isValid 
        ) )
    }
}