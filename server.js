const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Uncaught Exception Handler
process.on('uncaughtException', err => {
  console.log(err.name);
  console.log(err.message);
  process.exit(1);
});

// Environment Variables config file
dotenv.config({ path: './config.env' });
const app = require('./app');

// Database string with Password
const dbUrl = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD).replace(
  '<DB_NAME>',
  process.env.DATABASE_CLUSTER_NAME
);

console.log(`Current Node Environment = ${process.env.NODE_ENV}`);

// Connect the MongoDB remote Database to the application/API using Mongoose
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB was successfully Connected!✔'))
  .catch(err => {
    console.log('Mongo DB Connection Failed ❌', err);
  });

// Server Port Number and Server's Event Loop
const port = 3000;
const myServer = app.listen(port, () => {
  console.log(`Project Natura running on port localhost:${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name);
  console.log(err.message);
  myServer.close(() => {
    process.exit(1);
  });
});
