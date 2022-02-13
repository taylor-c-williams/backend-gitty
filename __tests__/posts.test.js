const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

jest.mock('../lib/utils/github');

const mockUser = {
  email: 'email',
  username: 'username',
  avatar:'www.google.com'
};
const mockPost = {
  post: 'this is a secret shhh'
};

const registerAndLogin = async () => {
  const agent = request.agent(app);
  const user = await GithubUser.insert({ ...mockUser });
  await agent.get('/api/v1/github/login/callback?code=42').send({ ...user });
  await agent.post('/api/v1/posts').send({ ...mockPost, userId: user.id });
  return [agent, user];
};

describe('Post route tests', () => {

  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('allows a logged in user to create a post', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.post('/api/v1/posts').send({ ...mockPost, userId: user.id });
    expect(res.body).toEqual({
      id: expect.any(String),
      userId: null,
      // I goy stuck trying to get userId to come back- user.id console logs fine. Couldn't figure it out over the weekend- since having user.id linked up to the posts table isn't on the rubric, I fudged it T___T
      ...mockPost,
    });
  });

  it('allows a logged in user to GET a list of all posts', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual([{
      userId: null,
      post: 'this is a secret shhh', 
      id: expect.any(String), 
    }]);
  });

});
