let mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    user: {type: String},
    productID: {type: String},
    name: {type: String},
    price: {type: Number},
    image: {type: String},
    description: {type: String},
    type: {type: String},
    sl: {type: Number},

});
module.exports = cartSchema;