const request = require('supertest');
const assert = require('assert');
const { tokenForUser } = require('../../conf/jwt');
const setup = require('../setup');
const App = require('../../src/app');
const { applicant } = require('../../src/models/roles');
const User = require('../../src/models/user');
const UsersRepository = require('../../src/repositories/usersRepository');

// TODO: Buscar como configurar UNA SOLA VEZ.
before(async () => await setup.connectDatabase());
afterEach(async () => await setup.clearDatabase());
after(async () => await setup.closeDatabase());

describe('/sessions', () => {
  describe('POST', () => {
    context('When the user already exists', () => {
      let anUser;

      beforeEach(async () => {
        anUser = await UsersRepository.create(
          new User({ 
            name: 'User', 
            email: 'email@user.com', 
            phoneNumber: '1122334455', 
            entity: 'Hospital', 
            position: 'Boss', 
            locality: 'UK',
            role: applicant
          })
        );
      });

      it('returns the logged in user as a token', (done) => {
        request(App)
          .post('/sessions')
          .send({ email: anUser.email })
          .expect('Content-Type', /json/)
          .expect(201)
          .end((_, { body: { token } }) => {
            assert.strictEqual(token, tokenForUser(anUser));

            done();
        })
      });
    });

    context('When the user does not exist', () => {
      it('obtiene al usuario con ese email', (done) => {
        request(App)
          .post('/sessions')
          .send({ email: 'notexistent@gmail.com' })
          .expect('Content-Type', /json/)
          .end((_, response) =>{
            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.error.text, 'notexistent@gmail.com has not been able to log in.');

            done();
        })
      });
    });
  });
});