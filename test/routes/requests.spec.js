const request = require('supertest');
const assert = require('assert');
const { tokenForUser } = require('../../conf/jwt');
const setup = require('../setup');
const App = require('../../src/app');
const Request = require('../../src/models/request');
const { administrator, applicant } = require('../../src/models/roles');
const UsersRepository = require('../../src/repositories/usersRepository');
const RequestsRepository = require('../../src/repositories/requestsRepository');
const User = require('../../src/models/user');
const { faceMasks } = require('../../src/models/supplies');

// TODO: Buscar como configurar UNA SOLA VEZ.
before(async () => await setup.connectDatabase());
afterEach(async () => await setup.clearDatabase());
after(async () => await setup.closeDatabase());

describe('/requests', () => {
  describe('GET', () => {
    let anUser, anotherUser, adminUser;

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

      anotherUser = await UsersRepository.create(
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

      await RequestsRepository.create(new Request({ userId: anUser._id, area: 'RRHH', supply: faceMasks }));
      await RequestsRepository.create(new Request({ userId: anUser._id, area: 'RRHH', supply: faceMasks }));
      await RequestsRepository.create(new Request({ userId: anUser._id, area: 'RRHH', supply: faceMasks }));
      await RequestsRepository.create(new Request({ userId: anotherUser._id, area: 'RRHH', supply: faceMasks }));
      await RequestsRepository.create(new Request({ userId: anotherUser._id, area: 'RRHH', supply: faceMasks }));
      await RequestsRepository.create(new Request({ userId: anotherUser._id, area: 'RRHH', supply: faceMasks }));
    });

    context('When the current user is an Admin', () => {
      it('Returns all the requests', (done) => {
        request(App)
          .get('/requests')
          .set('userToken', tokenForUser(adminUser))
          .expect('Content-Type', /json/)
          .end((_, response) => {
            assert.strictEqual(response.body.length, 6);
  
            done();
          });
      });
    });

    context('When the current user is not an Admin', () => {
      it('Returns all requests that belong to the user', (done) => {
        request(App)
          .get('/requests')
          .set('userToken', tokenForUser(anUser))
          .expect('Content-Type', /json/)
          .end((_, response) => {
            const requests = response.body;

            assert.strictEqual(requests.length, 3);
            requests.forEach((request) => assert.equal(request.userId, anUser._id));
  
            done();
          });
      });
    });

    context('When the user token is not present', () => {
      it('Returns all requests that belong to the user', (done) => {
        request(App)
          .get('/requests')
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
    context('When a user token is present', () => {
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

      it('Creates a new request for the user in the token', (done) => {
        request(App)
          .post('/requests')
          .send({
            area: 'RRHH',
            supply: faceMasks,
          })
          .set('userToken', tokenForUser(anUser))
          .expect('Content-Type', /json/)
          .expect(201, {})
          .end(async () => {
            const userRequests = await RequestsRepository.findAllByUserId(anUser._id);
            assert.strictEqual(userRequests.length, 1);
  
            done();
          })
      });
    });

    context('When the user token is not present', () => {
      it('Returns all requests that belong to the user', (done) => {
        request(App)
          .post('/requests')
          .expect('Content-Type', /json/)
          .end((_, response) => {
            assert.strictEqual(response.status, 401);
            assert.strictEqual(response.error.text, 'Token not found.');
  
            done();
          });
      });
    });
  });
  
  describe('PATCH', () => {
    describe('/requests/:id/cancel', () => {
      let anUser, anotherUser, userRequest;

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

        anotherUser = await UsersRepository.create(
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

        userRequest = await RequestsRepository.create(new Request({ userId: anUser._id, area: 'RRHH', supply: faceMasks }));
        anotherUserRequest = await RequestsRepository.create(new Request({ userId: anotherUser._id, area: 'RRHH', supply: faceMasks }));
      });

      context('When the user token is present', () => {
        context('When the requested request exists and belongs to the user', () => {
          it('Cancels the request', (done) => {
            request(App)
              .patch(`/requests/${userRequest._id}/cancel`)
              .set('userToken', tokenForUser(anUser))
              .end(async (_, res)=> {
                updatedRequest = await RequestsRepository.findByIdAndUserId(userRequest._id, anUser._id);
                assert.strictEqual(updatedRequest.state, Request.STATES.CANCELLED);

                done();
              });
          });
        });

        context('When the requested request exists but does not belong to the user', () => {
          it('Returns an error and does not cancel the request', (done) => {
            request(App)
              .patch(`/requests/${anotherUserRequest._id}/cancel`)
              .set('userToken', tokenForUser(anUser))
              .expect(404, {})
              .end(async (_, res)=> {
                updatedAnotherUserRequest = await RequestsRepository.findByIdAndUserId(anotherUserRequest._id, anotherUser._id);
                assert.strictEqual(updatedAnotherUserRequest.state, Request.STATES.PENDING);

                done();
              });
          });
        });

        context('When the requested request does not exist', () => {
          it('Returns an error', (done) => {
            request(App)
              .patch(`/requests/${anotherUser._id}/cancel`)
              .set('userToken', tokenForUser(anUser))
              .expect(404, {})
              .end(async (_, res)=> {
                done();
              });
          });
        });
      });

      context('When the user token is not present', () => {
        it('Returns an error', (done) => {
          request(App)
            .patch(`/requests/${userRequest._id}/cancel`)
            .expect('Content-Type', /json/)
            .end((_, response) => {
              assert.strictEqual(response.status, 401);
              assert.strictEqual(response.error.text, 'Token not found.');
    
              done();
            });
        });
      });
    });

    describe('/requests/:id/approve', () => {
      let anUser, adminUser, userRequest;

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
  
        userRequest = await RequestsRepository.create(new Request({ userId: anUser._id, area: 'RRHH', supply: faceMasks }));
      });

      context('When the user token is present', () => {
        context('When the current user is an Admin', () => {
          context('When the requested request exists and belongs to the user', () => {
            it('Approves the request', (done) => {
              request(App)
                .patch(`/requests/${userRequest._id}/approve`)
                .send({ provider: 'Provider' })
                .set('userToken', tokenForUser(adminUser))
                .end(async (_, res)=> {
                  updatedRequest = await RequestsRepository.findByIdAndUserId(userRequest._id, anUser._id);
                  assert.strictEqual(updatedRequest.state, Request.STATES.APPROVED);
  
                  done();
                });
            });
          });
  
          context('When the requested request does not exist', () => {
            it('Returns an error', (done) => {
              request(App)
                .patch(`/requests/${anUser._id}/approve`)
                .send({ provider: 'Provider' })
                .set('userToken', tokenForUser(adminUser))
                .expect(404, {})
                .end(async (_, res)=> {
                  done();
                });
            });
          });
        });
    
        context('When the current user is not an Admin', () => {
          it('Returns an error', (done) => {
            request(App)
              .patch(`/requests/${userRequest._id}/approve`)
              .send({ provider: 'Provider' })
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
            .patch(`/requests/${userRequest._id}/approve`)
            .send({ provider: 'Provider' })
            .expect('Content-Type', /json/)
            .end((_, response) => {
              assert.strictEqual(response.status, 401);
              assert.strictEqual(response.error.text, 'Token not found.');
    
              done();
            });
        });
      });
    });

    describe('/requests/:id/reject', () => {
      let anUser, adminUser, userRequest;

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
  
        userRequest = await RequestsRepository.create(new Request({ userId: anUser._id, area: 'RRHH', supply: faceMasks }));
      });

      context('When the user token is present', () => {
        context('When the current user is an Admin', () => {
          context('When the requested request exists and belongs to the user', () => {
            it('Rejects the request', (done) => {
              request(App)
                .patch(`/requests/${userRequest._id}/reject`)
                .send({ rejectionReason: 'No available' })
                .set('userToken', tokenForUser(adminUser))
                .end(async (_, res)=> {
                  updatedRequest = await RequestsRepository.findByIdAndUserId(userRequest._id, anUser._id);
                  assert.strictEqual(updatedRequest.state, Request.STATES.REJECTED);
  
                  done();
                });
            });
          });
  
          context('When the requested request does not exist', () => {
            it('Returns an error', (done) => {
              request(App)
                .patch(`/requests/${anUser._id}/reject`)
                .send({ rejectionReason: 'No available' })
                .set('userToken', tokenForUser(adminUser))
                .expect(404, {})
                .end(async (_, res)=> {
                  done();
                });
            });
          });
        });
    
        context('When the current user is not an Admin', () => {
          it('Returns an error', (done) => {
            request(App)
              .patch(`/requests/${userRequest._id}/reject`)
              .send({ rejectionReason: 'No available' })
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
            .patch(`/requests/${userRequest._id}/reject`)
            .send({ rejectionReason: 'No available' })
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
});


