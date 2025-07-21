const mongoose = require('mongoose');

const YourSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  customer_name: { type: String, index: true },
  status: { type: String, index: true },
  // ...other fields...
});


module.exports = mongoose.model('YourModel', YourSchema);