const express = require('express');
const { engine } = require('express-handlebars');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 3030;
const bodyParser = require('body-parser');
const loginRouter = require('./routes/loginRouter');
const registerRouter = require('./routes/registerRouter');
const fgpdRouter = require('./routes/fgpdRouter');
const homeRouter = require('./routes/homeRouter');
require('dotenv').config();

app.use(express.static('public/css'));
app.use(express.static('public/js'));
app.use(express.static('public/img'));

app.use(session({
  secret: process.env.SESSION_SECRET_KEY, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, 
  }
}));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("combined"));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/fgpd', fgpdRouter);
app.use('/home', homeRouter);

app.listen(port, () =>{
  console.log("listening at http://localhost:3030/login");
  console.log("listening at http://localhost:3030/home");
});