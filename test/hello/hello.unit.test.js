const chai = require('chai');
// var sinon = require('sinon');
const sinonChai = require('sinon-chai');
const {mockReq, mockRes} = require('sinon-express-mock');

const {hello, helloUser} = require('../../js/hello/hello.js');

const expect = chai.expect;
chai.use(sinonChai);


describe('Hello', () => {
  let req;
  let res;

  beforeEach('init', () => {
    req = mockReq({
      params: {
        username: 'test',
      },
    });
    res = mockRes();
  });

  describe('hello', () => {
    it('should respond "Hello, World!"', async () => {
      hello(req, res);

      const resBody = 'Hello, World!';

      expect(res.send).has.been.calledOnce;
      expect(res.send).to.have.been.calledWith(resBody);
    });
  });

  describe('helloUser', () => {
    it('should respond "Hello, test!"', async () => {
      helloUser(req, res);

      const resBody = `Hello, ${req.params.username}!`;

      expect(res.send).has.been.calledOnce;
      expect(res.send).to.have.been.calledWith(resBody);
    });
  });
});
