const { loginAsApplicant, getOrganizations, createRequest, getRequests, loginAsAdministrator, rejectRequest } = require('./actions');

const execute = async () => {
  const applicantUserToken = await loginAsApplicant();
  const [ organization ] = await getOrganizations(applicantUserToken);
  const [ supply ] = organization.supplies;
  await createRequest(applicantUserToken, 'Health Care', supply);

  const administratorUserToken = await loginAsAdministrator();
  const requests = await getRequests(administratorUserToken);
  const [ pendingRequest ] = requests.filter(request => request.state === 'PENDING');
  await rejectRequest(administratorUserToken, pendingRequest._id, 'Already fulfilled.');
};

execute();
