<div align="center">

<img src="assets/logo-512.png" width="96" alt="graphql-forum">

# graphql-forum

**A typed GraphQL forum backend: posts, comments, authors.**

[![CI](https://github.com/marcus-beauregard/graphql-forum/actions/workflows/ci.yml/badge.svg)](https://github.com/marcus-beauregard/graphql-forum/actions/workflows/ci.yml)
[![License: GPL-2.0-or-later](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](LICENSE)

</div>

## Quick start

```bash
npm install
npm start
# graphql-forum ready at http://localhost:4000/ by default. You can change the port by setting the `PORT` environment variable.
```

Open ```http://localhost:4000/``` for Apollo Sandbox, or use curl:

```bash
curl -s localhost:4000/ -H 'content-type: application/json' \
  -d '{"query":"mutation { createPost(title: \"Hello\", body: \"First post\") { id title } }"}'
```

## Schema

```graphql
type Post    { id: ID!  title: String!  body: String!  author: User!  comments: [Comment!]! }
type User    { id: ID!  name: String!  posts: [Post!]! }
type Comment { id: ID!  body: String!  author: User! }

type Query {
  post(id: ID!): Post
}

type Mutation {
  createPost(title: String!, body: String!, authorId: ID): Post!
  addComment(postId: ID!, body: String!): Comment!
}
```

## Develop

```bash
npm test    # node --test
```

Four tests cover ```createPost```; everything else is unprotected (#10).

## Known gaps

Data lives in module-level arrays (#8), there is no pagination (#9), and Apollo Server 3 is end-of-life (#7). All tracked.

## Contributing

Humans and automated agents are both welcome. There is no CLA — every commit carries a [DCO](https://developercertificate.org/) sign-off (**git commit -s**).

Start with a [good first issue](https://github.com/marcus-beauregard/graphql-forum/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22), or read [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

GPL-2.0-or-later — see [LICENSE](LICENSE). Copyright (C) 2026 Marcus Beauregard.

Versions published before 2026-11-19 remain available under MIT; this licence applies to the current tree and every release from here.
