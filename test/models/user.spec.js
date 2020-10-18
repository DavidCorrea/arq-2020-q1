const assert = require('assert');
const User = require('../../src/models/user');

describe('Usuario', () => {
  const userFields = {
    name: 'Natalia Natalia',
    email: 'natalia@unknown.com',
    phoneNumber: '1500000000',
    entity: 'Hospital de desconocidos',
    position: 'Administrativo',
    locality: 'Varela'
  };

  const assertErrorInUserCreation = (fields, errorMessage) => {
    assert.throws(() => new User(fields), { name: 'Error', message: errorMessage });
  };

  describe('When the name is empty', () => {
    it('Raises an error', () => {
      assertErrorInUserCreation({ ...userFields, name: '' }, 'Name is empty');
    });
  });

  describe('When the email is empty', () => {
    it('Raises an error', () => {
      assertErrorInUserCreation({ ...userFields, email: '' }, 'Email is empty');
    });
  });

  describe('When the email has the wrong format', () => {
    it('Raises an error', () => {
      assertErrorInUserCreation({ ...userFields, email: 'notanemail' }, 'Email has not a valid format');
    });
  });

  describe('When the phone is empty', () => {
    it('Raises an error', () => {
      assertErrorInUserCreation({ ...userFields, phoneNumber: '' }, 'Phone Number is empty');
    });
  });

  describe('When the phone has the wrong format', () => {
    it('Raises an error', () => {
      assertErrorInUserCreation({ ...userFields, phoneNumber: 'notaphone' }, 'Phone Number has not a valid format');
    });
  });

  describe('When the entity is empty', () => {
    it('Raises an error', () => {
      assertErrorInUserCreation({ ...userFields, entity: '' }, 'Entity is empty');
    });
  });

  describe('When the position is empty', () => {
    it('Raises an error', () => {
      assertErrorInUserCreation({ ...userFields, position: '' }, 'Position is empty');
    });
  });

  describe('When the locality is empty', () => {
    it('Raises an error', () => {
      assertErrorInUserCreation({ ...userFields, locality: '' }, 'Locality is empty');
    });
  });
});