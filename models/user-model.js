const mongoose = require('mongoose');

const Schema = {
    username : String,
    email : String,
    image : String
}

module.exports = mongoose.model('user',Schema);