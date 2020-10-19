const { loginAsApplicant, getOrganizations, createRequest } = require('./actions');

const execute = async () => {
  Array.from(Array(1000).keys()).forEach(async (_) => {
    try {
      await new Promise(r => setTimeout(r, Math.random() * (10000 - 500) + 500));
      const userToken = await loginAsApplicant();
      const [ organization ] = await getOrganizations(userToken);
      const [ supply ] = organization.supplies;
      await createRequest(userToken, 'Health Care', supply);

      await new Promise(r => setTimeout(r, Math.random() * (10000 - 500) + 500));
      const administratorUserToken = await loginAsAdministrator();
      const requests = await getRequests(administratorUserToken);
      const [ pendingRequest ] = requests.filter(request => request.state === 'PENDING');
      await approveRequest(administratorUserToken, pendingRequest._id, organization.name);
    } catch(e) {
      console.log('Failure');
    }
  })
};

execute();

