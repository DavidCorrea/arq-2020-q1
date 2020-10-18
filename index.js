const app = require('./src/app');
const logger = require('./conf/logger');
const port = process.env.PORT || 4000;

app.listen(port, () => logger.serverInfo(`Server inicializado en puerto ${port}`));