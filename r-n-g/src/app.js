const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

// GraphQL Schema
// GraphQL schemas describe the shape of the data graph
// It defines set of types with fields that are populated from back-end data stores/database
const typeDefs = gql`
  type User {
    id: ID
    login: String
    avatar_url: String
    html_url: String
    followers_url: String
    type: String
  }

  type Query {
    users: [User]
  }
`;


// A resolver is a collection of functions that helps generate a response from a GraphQL query. 
const resolvers = {
  Query: {
    users: async () => {
      try {
        // A resolver has to match the appropriate schema by name. 
        // Therefore, here users refers to the users query defined in our schema. 
        // It's a function that fetches the data from the API with the help of axios and returns as expected the id, the login, and the avatar_url.
        const users = await axios.get('https://api.github.com/users');
        console.log('users from GitHub', users);
        return users.data.map(
          ({ id, login, avatar_url }) => ({
            id,
            login,
            avatar_url,
          })
        );
      } catch (error) {
        throw error;
      }
    },
  },
};

// ApolloServer is a constructor that receives an object as an argument. 
// And that object must contain the schema and the resolver to be able to create the server.
const server = new ApolloServer({
  // The parameter we pass is an object that holds the schema and the resolver to ApolloServer to create the server and then listens to it.
  typeDefs,
  resolvers,
});
//  typeDefs: typeDefs,
//  resolvers: resolvers
server.listen().then(({ url }) => console.log(`Server ready at ${url}`));