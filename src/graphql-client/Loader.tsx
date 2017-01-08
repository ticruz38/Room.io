import * as React from 'react';
import { execute, validate, DocumentNode, ExecutionResult, GraphQLError } from 'graphql'
import Schema from './Root';

type QueryArgs = {
    query: DocumentNode,
    variableValues?: {
        [key: string]: any;
    },
    operationName?: string
}

export default class Loader {

    constructor(query: QueryArgs, mutation?: DocumentNode[], subscription?: DocumentNode) {
        this.executeQuery(query)
    }

    validate(doc: DocumentNode): GraphQLError[] {
        const validationErrors = validate(Schema, doc);
        if (validationErrors.length > 0 ) {
            return validationErrors;
        }
    }

    executeMutation(mutation: DocumentNode, variables: {[key: string]: any}, mutationName?: string ) {
        execute(
            Schema,
            mutation,
            null,
            null,
            variables,
            mutationName
        ).then((result: ExecutionResult) => {
            Object.keys(result.data).map((key: string) => this[key] = result.data[key])
        });
    }

    executeQuery(queryArgs: QueryArgs) {
        const errors = this.validate(queryArgs.query);
        if(errors) return errors;
        execute(
            Schema,
            queryArgs.query,
            null, 
            null, 
            queryArgs.variableValues, 
            queryArgs.operationName
        ).then((result: ExecutionResult) => {
            Object.keys(result.data).map((key: string) => this[key] = result.data[key])
        });
    }
}