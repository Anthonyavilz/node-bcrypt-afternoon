require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const {register, login, logout} = require('./controllers/authController');
const {dragonTreasure, getUserTreasure, addUserTreasure, getAllTreasure} = require('./controllers/treasureController');
const {usersOnly, adminsOnly} = require('./middleware/authMiddleware');

const {SESSION_SECRET, CONNECTION_STRING} = process.env;
const app = express()

app.use(express.json());
massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('Im in');
});

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET,
    })
);

app.post('/auth/register', register);
app.post('/auth/login', login);
app.get('/auth/logout', logout);

app.get('/api/treasure/dragon', dragonTreasure);
app.get('/api/treasure/user', usersOnly ,getUserTreasure);
app.post('/api/treasure/user', usersOnly, addUserTreasure);
app.get('/api/treasure/all', usersOnly, adminsOnly, getAllTreasure);



app.listen(4000, () => console.log('Running on port 4000'))