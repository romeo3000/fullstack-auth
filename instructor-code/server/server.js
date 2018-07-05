require('dotenv').config();
const express = require('express'),
  axios = require('axios'),
  massive = require('massive'),
  session = require('express-session');

const app = express();

let {
  SERVER_PORT,
  REACT_APP_CLIENT_ID,
  CLIENT_SECRET,
  REACT_APP_DOMAIN,
  CONNECTION_STRING,
  SESSION_SECRET
} = process.env;

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
});

app.get('/auth/callback', async (req, res) => {
  // code from auth0 on req.query.code
  let payload = {
    client_id: REACT_APP_CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `http://${req.headers.host}/auth/callback`
  };

  // post request to exchange the code for a token
  let responseWithToken = await axios.post(
    `https://${REACT_APP_DOMAIN}/oauth/token`,
    payload
  );
  // use token to get user data of whom just logged in
  let userData = await axios.get(
    `https://${REACT_APP_DOMAIN}/userinfo?access_token=${
      responseWithToken.data.access_token
    }`
  );
  const db = req.app.get('db');
  let { sub, name, picture } = userData.data;
  let userExists = await db.find_user([sub]);
  if (userExists[0]) {
    req.session.user = userExists[0];
    res.redirect('http://localhost:3000/#/private');
  } else {
    db.create_user([sub, name, picture]).then(createdUser => {
      req.session.user = createdUser[0];
      res.redirect('http://localhost:3000/#/private');
    });
    // let createdUser = await db.create_user([sub, name, picture]);
    // req.session.user = createdUser[0];
    // res.redirect('/')
  }
});

app.get('/api/user-data', (req, res) => {
  if (req.session.user) {
    res.status(200).send(req.session.user);
  } else {
    res.status(401).send('Nice try sucka');
  }
});

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.redirect('http://localhost:3000/#/');
});

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port: ${SERVER_PORT}`);
});
