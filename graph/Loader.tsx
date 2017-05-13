import * as React from 'react';
import { execute, validate, DocumentNode, ExecutionResult, GraphQLError } from 'graphql'
import * as mobx from 'mobx';
import db from 'graph/IpfsApiStore';
import Schema from './index';

const Logger = require('logplease');
const logger = Logger.create('Loader')
export default class Loader {

    static execute( Document: DocumentNode, operationName: string, variables?: { [key: string]: any }, contextValue?, rootValue?): Promise<ExecutionResult> {
        const errors = validate( Schema, Document );
        Logger.info( "execute", operationName, errors, variables );
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
        logger.info( "execute", operationName, errors.map( e => e.message ) );
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

    subscribe( operationName: string, { variables, contextValue, rootValue, cb }: ExecuteParams = {} ) {
        const errors = validate( Schema, this.document );
        if ( errors.length ) return console.error( 'that subscribe operation' + operationName + 'is invalid', errors);
        // on event execute the query
        logger.info( "trigger", operationName );
        execute(
            Schema,
            this.document,
            rootValue,
            contextValue,
            variables,
            operationName
        ).then( result => {
            if ( result.errors ) this.graphQlErrors = result.errors.map( error => error.message );
            logger.info( "subscribe:then:result", result);
        } );
    }
}