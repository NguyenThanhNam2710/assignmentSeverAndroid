let mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: {type: String},
    password: {type: String}
});
module.exports = userSchema;