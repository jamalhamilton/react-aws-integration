const express = require('express');

const app = express();
// var mysql = require('mysql');
const config = require('./config/server_config');
// const myConnection = require('express-myconnection');

// importing routes
const routes = require('./routes');

// app.use(myConnection(mysql, {
//   host: config.db.host,
//   user: config.db.user,
//   password: config.db.password,
//   port: config.db.port,
//   database: config.db.database
// }, 'single'));

// routes
app.use('/api', routes);

const port = config.serverPort;

app.listen(port,'127.0.0.1', () => {
  console.log(`Server running on port ${port}`);
});
