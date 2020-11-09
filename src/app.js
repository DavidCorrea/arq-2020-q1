require('newrelic');

const express = require('express');
const cors = require('cors');
const requestLoggerMiddleware = require('./middlewares/requestLoggerMiddleware');
const usersRoutes = require('./routes/users');
const requestsRoutes = require('./routes/requests');
const sessionsRoutes = require('./routes/sessions');
const organizationsRoutes = require('./routes/organizations');
const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLoggerMiddleware);

app.use('/', sessionsRoutes);
app.use('/', usersRoutes);
app.use('/', requestsRoutes);
app.use('/', organizationsRoutes);

module.exports = app;
