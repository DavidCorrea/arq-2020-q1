const { get, post, patch } = require('./http');

const startSession = async (email) => {  
  return post('/sessions', { email });
};

const loginAsAdministrator = async () => {
  const { token } = await startSession('administrator@insumos.com');

  return token;
}

const loginAsApplicant = async () => {
  const { token } = await startSession('applicant@insumos.com')

  return token;
}

const getOrganizations = async (userToken) => {
  return get('/organizations', userToken);
};

const getRequests = async (userToken) => {
  return get('/requests', userToken);
};

const createRequest = async (userToken, area, supply) => {  
  return post('/requests', { area, supply }, userToken);
};

const cancelRequest = async (userToken, requestId) => {
  return patch(`/requests/${requestId}/cancel`, {}, userToken);
};

const approveRequest = async (userToken, requestId, provider) => {
  return patch(`/requests/${requestId}/approve`, { provider }, userToken);
};

const rejectRequest = async (userToken, requestId, rejectionReason) => {
  return patch(`/requests/${requestId}/reject`, { rejectionReason }, userToken);
};

module.exports = {
  loginAsAdministrator,
  loginAsApplicant,
  getOrganizations,
  getRequests,
  createRequest,
  cancelRequest,
  approveRequest,
  rejectRequest,
}