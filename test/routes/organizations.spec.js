const request = require('supertest');
const assert = require('assert');
const { tokenForUser } = require('../../conf/jwt');
const setup = require('../setup');
const App = require('../../src/app');
const { administrator, applicant } = require('../../src/models/roles');
const User = require('../../src/models/user');
const UsersRepository = require('../../src/repositories/usersRepository');
const { protectiveMasks, faceMasks, ventilators } = require('../../src/models/supplies');
const OrganizationsRepository = require('../../src/repositories/organizationsRepository');

// TODO: Buscar como configurar UNA SOLA VEZ.
before(async () => await setup.connectDatabase());
afterEach(async () => await setup.clearDatabase());
after(async () => await setup.closeDatabase());

describe('/organizations', () => {
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

      await OrganizationsRepository.create({ name: 'Org1', email: 'email1@mail.com', phoneNumber: '102', locality: 'Ville', supplies: [faceMasks] });
      await OrganizationsRepository.create({ name: 'Org2', email: 'email2@mail.com', phoneNumber: '101', locality: 'Ville', supplies: [protectiveMasks] });
      await OrganizationsRepository.create({ name: 'Org3', email: 'email3@mail.com', phoneNumber: '100', locality: 'Ville', supplies: [ventilators] });
    });
  
    context('When the user token is present', () => {
      context('When the current user is an Admin', () => {
        it('Returns all the supplies' , (done) => {
          request(App)
            .get('/organizations')
            .set('userToken', tokenForUser(adminUser))
            .expect('Content-Type', /json/)
            .expect(200, {})
            .end((_, { body }) => {
              const organizations = body;
              assert.strictEqual(organizations.length, 3);
    
              done();
            });
        });
      });
  
      context('When the current user is not an Admin', () => {
        it('Returns an error' , (done) => {
          request(App)
            .get('/organizations')
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
          .get('/organizations')
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