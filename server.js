import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { ApolloEngine  } from 'apollo-engine';

import schema from './data/schema';

const GRAPHQL_PORT = 3100;
const ENGINE_API_KEY = 'your ENGINE_API_KEY'; // see https://engine.apollographql.com for Api key

const graphQLServer = express();

const engine = new ApolloEngine({
  apiKey: ENGINE_API_KEY,
  stores: [
    {
      name: 'inMemEmbeddedCache',
      inMemory: {
        cacheSize: 20971520 // 20 MB
      }
    }
  ],
  queryCache: {
    publicFullQueryStore: 'inMemEmbeddedCache'
  }
});

graphQLServer.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({
      schema,
      context: {},
      // This option turns on tracing
      tracing: true,
      //this option is for caching
      cacheControl: true
    })
);

graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

engine.listen({
  port: GRAPHQL_PORT,
  graphqlPaths: ['/graphql'],
  expressApp: graphQLServer,
  launcherOptions: {
    startupTimeout: 3000,
  },
}, () => {
  console.log(`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`);
});