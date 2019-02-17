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
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const oauth2 = simpleOauthModule.create({
  client: {
    id: '552582400945.554222598951',
    secret: '24f2c9f868e6839b821f540e6b9026ee',
  },
  auth: {
    tokenHost: 'https://slack.com',
    tokenPath: '/api/oauth.access',
    authorizePath: '/oauth/authorize',
  },
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'https://jhacksslackbackend.herokuapp.com/callback',
  scope: 'chat:write:bot',
  state: '3(#0/!~',
});

// Initial page redirecting to YAHOO
app.get('/auth', (req, res) => {
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  const options = {
    code: code,
    redirect_uri: "https://jhacksslackbackend.herokuapp.com/callback"
  };
  try {
    const result = await oauth2.authorizationCode.getToken(options);

    console.log('The resulting token: ', result);

    const token = oauth2.accessToken.create(result);
    console.log(token.token.access_token)
  } catch (error) {
    console.error('Access Token Error', error.message);
    return res.status(400).json('Authentication failed');
  }
});

app.get('/info', (req, res) => {
    info.findById('5c69abbe12cd952414e418fb', function (err, docs) {
        res.status(200).send(docs);
      });
})



// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);