const request = require('supertest');
const assert = require('assert');
const { tokenForUser } = require('../../conf/jwt');
const setup = require('../setup');
const App = require('../../src/app');
const { administrator, applicant } = require('../../src/models/roles');
const User = require('../../src/models/user');
const UsersRepository = require('../../src/repositories/usersRepository');

// TODO: Buscar como configurar UNA SOLA VEZ.
before(async () => await setup.connectDatabase());
afterEach(async () => await setup.clearDatabase());
after(async () => await setup.closeDatabase());

describe('/users', () => {
  describe('GET', () => {
    let anUser, adminUser;

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

      adminUser = await UsersRepository.create(
        new User({ 
          name: 'User', 
          email: 'email@user.com', 
          phoneNumber: '1122334455', 
          entity: 'Hospital', 
          position: 'Boss', 
          locality: 'UK',
          role: administrator
        })
      );
    });

    context('When the user token is present', () => {
      context('When the current user is an Admin', () => {
        it('Returns all the users' , (done) => {
          request(App)
            .get('/users')
            .set('userToken', tokenForUser(adminUser))
            .expect('Content-Type', /json/)
            .expect(200, {})
            .end((_, { body }) => {
              const users = body;
              assert.strictEqual(users.length, 2);
    
              done();
            });
        });
      });
  
      context('When the current user is not an Admin', () => {
        it('Returns an error' , (done) => {
          request(App)
            .get('/users')
            .set('userToken', tokenForUser(anUser))
            .expect('Content-Type', /json/)
            .end((_, response) => {
              assert.strictEqual(response.status, 403);
              assert.strictEqual(response.error.text, 'Only administrators can perform this action.');
    
              done();
            });
        });
      });
    });

    context('When the user token is not present', () => {
      it('Returns an error', (done) => {
        request(App)
          .get('/users')
          .expect('Content-Type', /json/)
          .end((_, response) => {
            assert.strictEqual(response.status, 401);
            assert.strictEqual(response.error.text, 'Token not found.');
  
            done();
          });
      });
    });
  });

  describe('POST', () => {
    let anUser, adminUser;

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

      adminUser = await UsersRepository.create(
        new User({ 
          name: 'User', 
          email: 'email@user.com', 
          phoneNumber: '1122334455', 
          entity: 'Hospital', 
          position: 'Boss', 
          locality: 'UK',
          role: administrator
        })
      );
    });

    context('When the user token is present', () => {
      context('When the current user is an Admin', () => {
        it('Creates a new user' , (done) => {
          request(App)
            .post('/users')
            .set('userToken', tokenForUser(adminUser))
            .send({
              name: 'User', 
              email: 'email@user.com', 
              phoneNumber: '1122334455', 
              entity: 'Hospital', 
              position: 'Boss', 
              locality: 'UK'
             })
            .expect('Content-Type', /json/)
            .expect(201, {})
            .end(async () => {
              assert.strictEqual(await UsersRepository.count(), 3);
    
              done();
            })
        });
      });
  
      context('When the current user is not an Admin', () => {
        it('Returns an error' , (done) => {
          request(App)
            .post('/users')
            .set('userToken', tokenForUser(anUser))
            .send({
              name: 'User', 
              email: 'email@user.com', 
              phoneNumber: '1122334455', 
              entity: 'Hospital', 
              position: 'Boss', 
              locality: 'UK'
             })
            .expect('Content-Type', /json/)
            .end((_, response) => {
              assert.strictEqual(response.status, 403);
              assert.strictEqual(response.error.text, 'Only administrators can perform this action.');
    
              done();
            });
        });
      });
    });

    context('When the user token is not present', () => {
      it('Returns an error', (done) => {
        request(App)
          .post('/users')
          .send({
            name: 'User', 
            email: 'email@user.com', 
            phoneNumber: '1122334455', 
            entity: 'Hospital', 
            position: 'Boss', 
            locality: 'UK'
           })
          .expect('Content-Type', /json/)
          .end((_, response) => {
            assert.strictEqual(response.status, 401);
            assert.strictEqual(response.error.text, 'Token not found.');
  
            done();
          });
      });
    });
  });
});