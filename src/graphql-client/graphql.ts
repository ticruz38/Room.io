import { Source, parse, validate, execute } from 'graphql';

/*import * as schema from './schema'; // TODO generate schema in that folder

function fetchGraphql(query, variables) {
    const source = new Source(query, 'GraphQL request');
    let documentAST;
    try {
        documentAST = parse(source);
    } catch (syntaxError) {
        return { errors: [ syntaxError ] };
    }

    // Validate AST, reporting any errors.
    const validationErrors = validate(schema, documentAST);
    if (validationErrors.length > 0) {
        return { errors: validationErrors };
    }
}*/