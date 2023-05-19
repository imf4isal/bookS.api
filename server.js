const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, '.', err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('connection established');
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log('app is running....');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, '.', err.message);
  server.close(() => process.exit());
});
