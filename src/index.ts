import { ApolloServer } from 'apollo-server';
import { apolloConfig } from './presentation/api/graphQL/server';

const PORT = process.env.PORT || 4000;

const apolloServer = new ApolloServer(apolloConfig);
const startServer = async () => {
  await apolloServer.listen({ port: PORT });
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
