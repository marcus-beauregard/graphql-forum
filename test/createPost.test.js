const test = require('node:test');
const assert = require('node:assert/strict');
const { resolvers } = require('../schema');

const { createPost } = resolvers.Mutation;
const postCount = () => resolvers.Query.posts().length;

test('createPost defaults to the current author when authorId is omitted', () => {
  const post = createPost(null, { title: 'Default author', body: 'body' });
  assert.equal(post.authorId, '1');
  assert.equal(resolvers.Post.author(post).name, 'Marcus');
});

test('createPost stores the author it was given', () => {
  const post = createPost(null, { title: 'Ada writes', body: 'body', authorId: '2' });
  assert.equal(post.authorId, '2');
  assert.equal(resolvers.Post.author(post).name, 'Ada');
});

test('createPost rejects an unknown author and stores nothing', () => {
  const before = postCount();
  assert.throws(
    () => createPost(null, { title: 'Ghost', body: 'body', authorId: '999' }),
    (err) => err.name === 'UserInputError' && /No user with id "999"/.test(err.message),
  );
  assert.equal(postCount(), before);
});

test('createPost rejects an empty or whitespace-only title and stores nothing', () => {
  for (const title of ['', '   ', '\t\n']) {
    const before = postCount();
    assert.throws(
      () => createPost(null, { title, body: 'Valid body' }),
      (err) => err.name === 'UserInputError' && /title/i.test(err.message),
    );
    assert.equal(postCount(), before);
  }
});

test('createPost rejects an empty or whitespace-only body and stores nothing', () => {
  for (const body of ['', '   ', '\t\n']) {
    const before = postCount();
    assert.throws(
      () => createPost(null, { title: 'Valid title', body }),
      (err) => err.name === 'UserInputError' && /body/i.test(err.message),
    );
    assert.equal(postCount(), before);
  }
});

test('createPost creates a post when title and body are non-empty', () => {
  const before = postCount();
  const post = createPost(null, { title: 'Valid title', body: 'Valid body', authorId: '2' });
  assert.equal(post.title, 'Valid title');
  assert.equal(post.body, 'Valid body');
  assert.equal(post.authorId, '2');
  assert.equal(postCount(), before + 1);
});
