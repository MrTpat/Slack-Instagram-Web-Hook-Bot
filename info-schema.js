const mongoose = require('mongoose');

const infoSchema = mongoose.Schema({
    slackchatID: { type: String },
    instagramTag: {type: String}
});

module.exports = mongoose.model('Info', infoSchema);