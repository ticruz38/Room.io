import * as mobx from 'mobx'

import 'whatwg-fetch';

export const graphQLFetcher = (graphQLParams: { query: string, variables: { [s: string]: any } } ) => {
  return fetch('http://localhost:3800/graphql', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(graphQLParams)
  }).then((response: any) => response.json())
}

class GraphStore {

  getQuery = (fragments: {[s: string]: string}, variable: string) => `
    query RootQueryType${variable ? `(${variable})` : ''} {
      ${Object.keys(fragments).map(fragment => '...'+fragment+',')}
    }
    ${Object.keys(fragments).map(fragment=> fragments[fragment])}
  `;

  graphRequest = (fragments: {[s: string]: string}, variableString: string, variables: { [s: string]: any }) => {
    const query = this.getQuery( fragments, variableString)
    return graphQLFetcher({query: query, variables: variables})
  };
  
}

export default new GraphStore();