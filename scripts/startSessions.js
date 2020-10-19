const { loginAsAdministrator, loginAsApplicant } = require('./actions');

const execute = async () => {
  await loginAsAdministrator();
  await loginAsApplicant();
};

execute();