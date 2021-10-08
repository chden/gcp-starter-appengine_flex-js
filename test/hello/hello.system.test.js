const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Hello', () => {
  const path = '';
  let url;

  before('Initialize service url', function() {
    url = process.env.BASE_URL;
    if (!url) {
      throw new Error('No BASE_URL provided!');
    }
  });

  describe('hello', () => {
    const resBody = 'Hello, World!';

    it('should respond "Hello, World!"', async () => {
      await chai.request(url)
        .get(path)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.text).to.equal(resBody);
        });
    });
  });

  describe('helloUser', () => {
    const username = 'test';
    const resBody = `Hello, ${username}!`;

    it('should respond "Hello, test!"', async () => {
      await chai.request(url)
        .get(`${path}/${username}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.text).to.equal(resBody);
        });
    });
  });
});
