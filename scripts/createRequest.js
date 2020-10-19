const { loginAsApplicant, getOrganizations, createRequest } = require('./actions');

const execute = async () => {
  const userToken = await loginAsApplicant();
  const [ organization ] = await getOrganizations(userToken);
  const [ supply ] = organization.supplies;

  await createRequest(userToken, 'Health Care', supply);
};

execute();

