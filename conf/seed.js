const mongoose = require('./db');
const logger = require('./logger');
const UsersRepository = require('../src/repositories/usersRepository');
const OrganizationsRepository = require('../src/repositories/organizationsRepository');
const { applicant, administrator } = require('../src/models/roles');
const { protectiveMasks, faceMasks, ventilators, medicalGloves, medicines } = require('../src/models/supplies');

const seedDB = async () => {
  logger.serverInfo('Creating Admin and User...');

  const administratorEmail = 'administrator@insumos.com';
  const administratorUser = await UsersRepository.findByEmail(administratorEmail);

  const applicantEmail = 'applicant@insumos.com';
  const applicantUser = await UsersRepository.findByEmail(applicantEmail);

  if(!administratorUser && !applicantUser) {
    await UsersRepository.create({
      name: 'Administrator',
      email: administratorEmail,
      phoneNumber: '1122223333',
      entity: 'UNQ',
      position: 'Administrator',
      locality: 'Ville',
      role: administrator,
    });

    await UsersRepository.create({
      name: 'Applicant',
      email: applicantEmail,
      phoneNumber: '1122223333',
      entity: 'UNQ',
      position: 'Applicant',
      locality: 'Ville',
      role: applicant,
    });

    logger.serverInfo('Admin and User created successfully.');
  } else {
    logger.serverInfo('Admin and User were already created.');
  }

  logger.serverInfo('Creating Organizations...');

  const labs1 = 'labs_1@gmail.com';
  const labs2 = 'labs_2@gmail.com';
  const labs1Organization = await OrganizationsRepository.findByEmail(labs1);
  const labs2Organization = await OrganizationsRepository.findByEmail(labs2);

  if(!labs1Organization && !labs2Organization) {
    await OrganizationsRepository.create({
      name: 'LABS 1',
      email: labs1,
      phoneNumber: '1122223333',
      locality: 'Ville',
      supplies: [protectiveMasks, faceMasks]
    });

    await OrganizationsRepository.create({
      name: 'LABS 2',
      email: labs2,
      phoneNumber: '3322221111',
      locality: 'Ville',
      supplies: [ventilators, medicalGloves, medicines]
    });

    logger.serverInfo('Organizations created successfully.');
  } else {
    logger.serverInfo('Organizations were already created.');
  }

  mongoose.disconnect();
};

seedDB();



