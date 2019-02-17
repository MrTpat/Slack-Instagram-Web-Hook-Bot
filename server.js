const express = require('express');
const app = express();
const simpleOauthModule = require('simple-oauth2');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const info = require('./info-schema');
mongoose.connect('mongodb+srv://tilak:Basketball23@cluster0-vyhsz.mongodb.net/test?retryWrites=true&useNewUrlParser=true').then(() => {
  console.log('Connected!');
}).catch(() => {
  console.log('Error');
});
app.use(bodyParser.json({
  extended: true
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/info', (req, res) => {
    info.findById('5c69abbe12cd952414e418fb', function (err, docs) {
        res.status(200).send(docs);
      });
})

app.post('/update', (req, res) => {
  console.log(req.body)
  info.findByIdAndUpdate('5c69abbe12cd952414e418fb', {oauthToken: req.body.token, instaTAG: req.body.tag, channel: req.body.channel}, function(err, doc){
    if (err) return res.send(500, { error: err });
    console.log(doc)
    return res.status(200).send();
});
})



// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);