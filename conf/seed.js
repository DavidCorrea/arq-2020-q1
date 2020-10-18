const mongoose = require('./db');
const { logger } = require('./logger');
const repositorioUsuarios = require('../src/repositorios/repositorioUsuarios');
const repositorioDeOrganizaciones = require('../src/repositorios/repositorioDeOrganizaciones');
const { administrador, solicitante } = require('../src/modelos/roles');
const Insumos = require('../src/modelos/insumos');

const seedearDB = async () => {
  logger.serverInfo(`Creando usuario administrador inicial`);

  const emailAdministrador = 'admin@insumos.com';
  const usuarioAdministrador = await repositorioUsuarios.obtenerPorEmail(
    emailAdministrador);

  const emailDave = 'dave@insumos.com';
  const dave = await repositorioUsuarios.obtenerPorEmail(
    emailDave);

  const emailMartin = 'martin@insumos.com';
  const martin = await repositorioUsuarios.obtenerPorEmail(
    emailAdministrador);

  if(!usuarioAdministrador && !dave && !martin) {
    await repositorioUsuarios.agregar({
      nombre: 'Admin',
      email: emailAdministrador,
      telefono: '1122223333',
      entidad: 'UNQ',
      cargo: 'Admin de insumos',
      localidad: 'Bernal',
      rol: administrador,
    });

    await repositorioUsuarios.agregar({
      nombre: 'Dave',
      email: emailDave,
      telefono: '43211234',
      entidad: 'UNQ',
      cargo: 'Estudiante',
      localidad: 'Hudson',
      rol: solicitante,
    });

    await repositorioUsuarios.agregar({
      nombre: 'Martin',
      email: emailMartin,
      telefono: '12344321',
      entidad: 'UNQ',
      cargo: 'Estudiante',
      localidad: 'Capital',
      rol: solicitante,
    });

    logger.serverInfo(
      `Se ha creado el usuario administrador inicial satisfactoriamente`);
  } else {
    logger.serverInfo(`El usuario administrador ya existía previamente`);
  }

  logger.serverInfo(`Creando organizaciones iniciales`);

  const unqEmail = 'unq_labs@gmail.com';
  const bernalEmail = 'bernal_labs@gmail.com';
  const unqLaboratorio = await repositorioDeOrganizaciones.obtenerPorEmail(
    unqEmail);
  const bernalProveedor = await repositorioDeOrganizaciones.obtenerPorEmail(
    bernalEmail);

  if(!bernalProveedor && !unqLaboratorio) {
    await repositorioDeOrganizaciones.agregar({
      nombre: 'UNQ LABS',
      email: unqEmail,
      telefono: '1122223333',
      localidad: 'Bernal',
      insumos: [Insumos.medicamentos, Insumos.guantes],
    });

    await repositorioDeOrganizaciones.agregar({
      nombre: 'Bernal laboratorio',
      email: bernalEmail,
      telefono: '3322221111',
      localidad: 'Bernal',
      insumos: [
        Insumos.guantes,
        Insumos.respiradores,
        Insumos.barbijos,
        Insumos.mascarasProtectoras],
    });

    logger.serverInfo('Se crearon las organizaciones');
  } else {
    logger.serverInfo('Las organizacioens ya existían');
  }

  mongoose.disconnect();
};

seedearDB();



