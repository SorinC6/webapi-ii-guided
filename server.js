const express = require('express');
const hubRoutes = require('./routes');
//const Hubs = require('./hubs/hubs-model.js'); //routes will need this

const server = express();

//server.use(express.json()); //routes will need this

server.use(hubRoutes);

module.exports = server;
