const { request } = require('express');
const { loginAsApplicant, getOrganizations, createRequest, getRequests, loginAsAdministrator, approveRequest } = require('./actions');

const execute = async () => {
  const applicantUserToken = await loginAsApplicant();
  const [ organization ] = await getOrganizations(applicantUserToken);
  const [ supply ] = organization.supplies;
  await createRequest(applicantUserToken, 'Health Care', supply);

  const administratorUserToken = await loginAsAdministrator();
  const requests = await getRequests(administratorUserToken);
  const [ pendingRequest ] = requests.filter(request => request.state === 'PENDING');
  await approveRequest(administratorUserToken, pendingRequest._id, organization.name);
};

execute();
