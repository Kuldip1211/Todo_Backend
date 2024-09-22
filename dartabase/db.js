const mongoose = require('mongoose');
require('dotenv').config(); 

const Databaseconnector = () => {
 // mongodb+srv://kuldeepchudasama6999:4mzEIAvjtcO5FwLV@taskmanager.bifnhq0.mongodb.net/

 mongoose.connect(`${process.env.DATABASE}`)
  .then(() => console.log('Database connected sucseefully 🚀🚀🚀'));
}

module.exports = Databaseconnector;