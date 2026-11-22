// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 Marcus Beauregard
const PORT = process.env.PORT || 4000;

const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('./schema');

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(PORT).then(({ url }) => console.log('graphql-forum ready at ' + url));
