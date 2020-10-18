class Request {
  constructor({userId, area, supply}) {
    this.userId = userId;
    this.area = area;
    this.supply = supply;
    this.state = Request.STATES.PENDING;

    this._validateFields();
  }

  static STATES = {
    PENDING: "PENDING", 
    CANCELLED: "CANCELLED", 
    APPROVED: "APPROVED", 
    REJECTED: "REJECTED"
  };

  _validateFields() {
    this._validateEmptyness(this.area, 'Area');
    this._validateEmptyness(this.supply, 'Supply');
    this._validateEmptyness(this.userId, 'User');
  }

  _validateEmptyness(field, fieldName) {
    if(field === '') { throw new Error(`${fieldName} is empty`); }
  }
}

module.exports = Request;
