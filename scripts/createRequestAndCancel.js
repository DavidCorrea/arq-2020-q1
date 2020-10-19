const { loginAsApplicant, getOrganizations, createRequest, getRequests, cancelRequest } = require('./actions');

const execute = async () => {
  const applicantUserToken = await loginAsApplicant();
  const [ organization ] = await getOrganizations(applicantUserToken);
  const [ supply ] = organization.supplies;
  await createRequest(applicantUserToken, 'Health Care', supply);

  const [ request ] = await getRequests(applicantUserToken);
  await cancelRequest(applicantUserToken, request._id);
};

execute();
