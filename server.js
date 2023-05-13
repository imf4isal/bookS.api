const dotenv = require('dotenv');
const mongoose = require('mongoose');

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

// const bookSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'A book must have name.'],
//   },
//   author: {
//     type: String,
//     required: [true, 'Book must have author.'],
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
// });

// const Book = mongoose.model('Book', bookSchema);

const port = process.env.PORT;
app.listen(port, () => {
  console.log('app is running....');
});
