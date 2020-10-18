const { administrator, applicant } = require('./roles');

class User {
  constructor({_id, name, email, phoneNumber, entity, position, locality, role }) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.entity = entity;
    this.position = position;
    this.locality = locality;
    this.role = role;

    this._validateFields();
  }

  _validateFields() {
    this._validatePhoneNumber();
    this._validateEmail();
    this._validateEmptyness(this.name, 'Name');
    this._validateEmptyness(this.entity, 'Entity');
    this._validateEmptyness(this.position, 'Position');
    this._validateEmptyness(this.locality, 'Locality');
  }

  _validateEmail() {
    this._validateEmptyness(this.email, 'Email');
    this._validateFormat(this.email, /\S+@\S+\.\S+/, 'Email');
  }

  _validatePhoneNumber() {
    this._validateEmptyness(this.phoneNumber, 'Phone Number');
    this._validateFormat(this.phoneNumber, /\+?\d+/, 'Phone Number');
  }

  _validateEmptyness(field, fieldName) {
    if(field === '') { throw new Error(`${fieldName} is empty`); }
  }

  _validateFormat(field, format, fieldName) {
    if(!format.test(field)) { throw new Error(`${fieldName} has not a valid format`); }
  }

  isAdministrator() {
    return this.role === administrator;
  };

  isApplicant() {
    return this.role === applicant;
  }
}

module.exports = User;
