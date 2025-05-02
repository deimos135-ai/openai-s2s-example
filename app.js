const { createServer } = require('http');
const { createEndpoint } = require('@jambonz/node-client-ws');
const logger = require('pino')({ level: process.env.LOGLEVEL || 'info' });

// --- WebSocket-сервер для Jambonz ---
const wsServer = createServer();
const makeService = createEndpoint({ server: wsServer });
const wsPort = process.env.WS_PORT || 3000;

require('./lib/routes')({ logger, makeService });

wsServer.listen(wsPort, '0.0.0.0', () => {
  logger.info(`WebSocket server listening at 0.0.0.0:${wsPort}`);
});

// --- HTTP-сервер для Render healthcheck ---
const express = require('express');
const expressApp = express();
const httpPort = process.env.PORT || 8080;

expressApp.get('/', (req, res) => {
  res.status(200).send('OK');
});

expressApp.listen(httpPort, () => {
  logger.info(`Healthcheck server running at 0.0.0.0:${httpPort}`);
});
