// SPDX-License-Identifier: GPL-2.0-or-later
// Copyright (C) 2026 Marcus Beauregard

const fs = require('fs');
const path = require('path');
const { UserInputError } = require('apollo-server');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const users = [
  { id: '1', name: 'Marcus' },
  { id: '2', name: 'Ada' },
];
const posts = [
  { id: '1', title: 'Hello GraphQL', body: 'This is my first post.', authorId: '1' },
];
const comments = [];

const resolvers = {
  Query: {
    posts: () => posts,
    post: (_, { id }) => posts.find((p) => p.id === id),
    users: () => users,
  },
  Post: {
    author: (p) => users.find((u) => u.id === p.authorId),
    comments: (p) => comments.filter((c) => c.postId === p.id),
  },
  Comment: {
    author: (c) => users.find((u) => u.id === c.authorId),
  },
  Mutation: {
    createPost: (_, { title, body, authorId = '1' }) => {
      const author = users.find((u) => u.id === authorId);
      if (!author) throw new UserInputError(`No user with id "${authorId}"`);
      const post = { id: String(posts.length + 1), title, body, authorId: author.id };
      posts.push(post);
      return post;
    },
    addComment: (_, { postId, body }) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) throw new UserInputError(`No post with id "${postId}"`);
      const c = { id: String(comments.length + 1), body, postId: post.id, authorId: '2' };
      comments.push(c);
      return c;
    },
  },
};

module.exports = { typeDefs, resolvers };
