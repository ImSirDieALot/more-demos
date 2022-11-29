const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');
// Create our express app
const app = express();

const user = {
  name: 'Dohn Joe',
  age: 35,
  company: ' T-Mobile'
};

let message = "This is initial message";

const users = [
  {
    name: 'Dohn Joe',
    age: 35,
    company: ' T-Mobile',
  },
  {
    name: 'Joe Dohn',
    age: 45,
    company: ' T-Mobile',
  },
  {
    name: 'Joe Mama',
    age: 25,
    company: ' T-Mobile',
  },
];
// Create a schema using the buildSchema function from graphql
// Define a type Query. type definition of Query. Read Enpoint
// "hello" query returns a string type. There are multiple scalar types - id, string, int, float, boolean, id, list -[]
// All queries must have a resolver - Resolver defines what to return (Acts as an execution function)
const schema = buildSchema(`
  type User {
    name: String
    age: Int
    company: String
  }

  type GitUser {
    login: String
    id: Int
    node_id: String
    avatar_url: String
    gravatar_id: String
    url: String
    html_url: String
    followers_url: String
    following_url: String
    gists_url: String
    starred_url: String
    subscriptions_url: String
    organizations_url: String
    repos_url: String
    events_url: String
    received_events_url: String
    type: String
    site_admin: String
  }

  type Query {
    hello: String
    welcomeMessage(name: String): String
    getUser: User
    getUsers: [User]
    gitUsers: [GitUser]
    message: String
  }

  input UserInput {
    name: String!
    age: Int!
    company: String!
  }

  type Mutation {
    setMessage(newMessage: String): String 
    createUser(newUser: UserInput): User
  } 
`);

// createUser(name: String!, age: Int!, company: String!): User

const root = {
  hello: () => {
    return 'Hello World!';
  },
  welcomeMessage: (args) => {
    return `Welcome to Hercules, ${args.name}!`;
  },
  getUser: () => {
    return user;
  },
  getUsers: () => {
    return users;
  },
  gitUsers: async () => {
    const result = await axios.get('https://api.github.com/users');
    return result.data;
  },
  setMessage: ({ newMessage }) => {
    message = newMessage;
    return message;
  },
  message: () => message,
  // createUser: ({ name, age, company }) => {
  //   // Create a new user 
  //   return { name, age, company };
  // }, 
  createUser: (args) => {
    return args.newUser;
  }
};

// Create our gql endpoint for al the requests
// this endpoint can be named anything
// graphjqlHTTP is used to handle the requests
app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: schema,
  rootValue: root, // provide resolvers
}))
// http://localhost:5000/graphql

app.listen(5000, () => console.log("Server on port 5000"));