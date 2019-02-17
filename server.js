const express = require('express');
const app = express();
const simpleOauthModule = require('simple-oauth2');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const info = require('./info-schema');
mongoose.connect('mongodb+srv://tilak:Basketball23@cluster0-vyhsz.mongodb.net/db?retryWrites=true&useNewUrlParser=true').then(() => {
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
    id: 'dj0yJmk9UlVqOW9lWURBSThnJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTNl',
    secret: '32dac19266153d081c340a7a1a6af038587e7a1f',
  },
  auth: {
    tokenHost: 'https://api.login.yahoo.com',
    tokenPath: '/oauth2/get_token',
    authorizePath: '/oauth2/request_auth',
  },
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'https://fantasynamegeneratorbackend.herokuapp.com/callback',
  scope: '',
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
    redirect_uri: "https://fantasynamegeneratorbackend.herokuapp.com/callback"
  };
  try {
    const result = await oauth2.authorizationCode.getToken(options);

    console.log('The resulting token: ', result);

    const token = oauth2.accessToken.create(result);
    res.redirect('http://fantasynamegenerator.s3-website.us-east-2.amazonaws.com/teamPicker/' + token.token.access_token);
  } catch (error) {
    console.error('Access Token Error', error.message);
    return res.status(400).json('Authentication failed');
  }
});

app.get('/info', (req, res) => {
    info.findById('5c68f3476da9b31ff45eb9cb', function (err, docs) {
        if(err){
            console.log(err)
        }
        res.status(200).send(docs);
        console.log(docs)
      });
})
app.get('/', (req, res) => {

  res.send('FORBIDDEN');
})



// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);