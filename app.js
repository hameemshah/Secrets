require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });
    newUser.save((err) => {
        if (err) return console.log(err);
        else res.render('secrets');
    });
});

app.post('/login', (req, res) => {
    const id = req.body.username;
    const pass = req.body.password;
User.findOne({email : id}, (err, result) => {
    if (err) res.send(err);
    else {
        if (result.password === pass){
            res.render('secrets');
        }
        else {
            res.send("Username and Password don't match.");
        }
    }
});
});
app.listen(3000, () => console.log('Server started at Port 3000'));
