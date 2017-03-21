import * as React from 'react';
import { execute, validate, DocumentNode, ExecutionResult, GraphQLError } from 'graphql'
import * as mobx from 'mobx';
import Schema from './index';


export default class Loader {

    static execute( Document: DocumentNode, operationName: string, variables?: { [key: string]: any }, contextValue?, rootValue?): Promise<ExecutionResult> {
        const errors = validate( Schema, Document );
        console.log( "execute", operationName, errors, variables );
        if ( errors.length ) return Promise.reject( errors );
        return execute(
            Schema,
            Document,
            rootValue,
            contextValue,
            variables,
            operationName
        );
    }


    graphQlErrors: string[];

    constructor( public document: DocumentNode, initialOperation?: string, executeParams?: ExecuteParams ) {
        if ( initialOperation ) this.execute( initialOperation, executeParams )
    }

    execute( operationName: string, { variables, contextValue, rootValue, cb }: ExecuteParams = {} ) {
        const errors = validate( Schema, this.document );
        console.log( "execute", operationName, errors.map( e => e.message ) );
        if ( errors.length ) return errors;
        execute(
            Schema,
            this.document,
            rootValue,
            contextValue,
            variables,
            operationName
        ).then( result => {
            if ( result.errors ) this.graphQlErrors = result.errors.map( error => error.message );
            if ( cb ) return cb( result.data, this );
            for ( const key in result.data ) {
                // this[key] = typeof this[key] === "object" && this[key].length === 0 ? result.data[key] : mobx.extendObservable( this[key] || {}, result.data[key] );
                this[key] = result.data[key];
            }
        } );
    }
}