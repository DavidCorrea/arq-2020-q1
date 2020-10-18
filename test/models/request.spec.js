const assert = require('assert');
const Request = require('../../src/models/request');

describe('Request', () => {
  const requestFields = {
    userId: 1,
    area: 'An area',
    supplyId: 1
  };

  const assertErrorInRequestCreation = (fields, errorMessage) => {
    assert.throws(() => new Request(fields), { name: 'Error', message: errorMessage });
  };

  describe('When the user is empty', () => {
    it('Raises an error', () => {
      assertErrorInRequestCreation({...requestFields, userId: ''}, 'User is empty');
    });
  });

  describe('When the area is empty', () => {
    it('Raises an error', () => {
      assertErrorInRequestCreation({...requestFields, area: ''}, 'Area is empty');
    });
  });

  describe('When the supply is not present', () => {
    it('Raises an error', () => {
      assertErrorInRequestCreation({...requestFields, supply: ''}, 'Supply is empty');
    });
  });
});