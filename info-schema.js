const mongoose = require('mongoose');

const infoSchema = mongoose.Schema({
    oauthToken: { type: String },
    instaTAG: {type: String},
    channel: {type: String}
});

module.exports = mongoose.model('Info', infoSchema);