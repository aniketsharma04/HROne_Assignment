const mongoose = require('mongoose');

const YourSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true }, 
});


module.exports = mongoose.model('YourModel', YourSchema);