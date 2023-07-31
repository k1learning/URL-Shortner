const mongoose = require('mongoose');
const shortID = require('shortid');

const shortUrlSchema = ({
    full: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required :true
    },
    short: {
        type: String,
        required: true,
        default: shortID.generate
    },
    email : String,
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('shortUrl', shortUrlSchema);
