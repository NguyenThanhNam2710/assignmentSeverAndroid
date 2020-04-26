let mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name: {type: String},
    price: {type: Number},
    description: {type: String},
    type: {type: String}
});
module.exports = productSchema;