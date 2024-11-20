const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const mongoURI = process.env.MONGO_URI || 'your-mongodb-atlas-url';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    friends: [String]
});

const User = mongoose.model('User', UserSchema);

app.use(cors());
app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password, friends: [] });
    await user.save();
    res.send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        const token = jwt.sign({[_{{{CITATION{{{_1{](https://github.com/edsyang/blog/tree/2ce48a2788db8d4f4b5f5f5dc8c388799ea5c0c2/docs%2Fcourse%2Fvue%2F13-Vue.js-D.part%20four.md)[_{{{CITATION{{{_2{](https://github.com/rmamchyk/chat-bots/tree/ac4d59c2dd9333f365e3096cc56041cdbc7bd440/server.js)
