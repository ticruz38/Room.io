import * as React from 'react';
import { execute, validate, DocumentNode, ExecutionResult, GraphQLError } from 'graphql'
import Schema from './Root';

export default class Loader {

    graphQlErrors: string[];

    constructor(public document: DocumentNode, initialOperation?: string) {
        if (initialOperation) this.execute(initialOperation)
    }

    execute(operationName: string, variables?: {[key: string]: any}) {
        console.log("execute");
        const errors = validate(Schema, this.document);
        if( errors.length ) return errors;
        execute(
            Schema,
            this.document,
            null,
            null,
            variables,
            operationName
        ).then( result => {
            console.log(result);
            for ( const key in result.data ) {
                this[key] = result.data[key]
                this.graphQlErrors = result.errors.map(error => error.message);
            }
        } );
    }
}