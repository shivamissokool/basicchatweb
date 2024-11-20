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

const mongoURI = process.env.MONGO_URI || 'your-mongodb-atlas-url'; // Ensure this is set in Railway

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));

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
    console.log('Received signup request:', username, password); // Debug log
    try {
        const user = new User({ username, password, friends: [] });
        await user.save();
        res.send('User registered');
    } catch (err) {
        console.error('Error during signup:', err); // Debug log
        res.status(500).send('Signup failed');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request:', username, password); // Debug log
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Error during login:', err); // Debug log
        res.status(500).send('Login failed');
    }
});

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('add-user', async (username) => {
        console.log('User added:', username);
        try {
            const user = await User.findOne({ username });
            if (user) {
                socket.join(user._id.toString());
                socket.userId = user._id;
                socket.username = username;
            } else {
                console.error('User not found:', username);
            }
        } catch (err) {
            console.error('Error adding user:', err);
        }
    });

    socket.on('message', (data) => {
        io.emit('message', { username: data.username, message: data.message });
    });

    socket.on('add-friend', async (data) => {
        const { username, friendUsername } = data;
        try {
            const user = await User.findOne({ username });
            const friend = await User.findOne({ username: friendUsername });
            if (user && friend) {
                if (!user.friends.includes(friendUsername)) {
                    user.friends.push(friendUsername);
                    await user.save();
                    socket.emit('update-friends-list', user.friends);
                }
            } else {
                console.error('Friend not found:', friendUsername);
            }
        } catch (err) {
            console.error('Error adding friend:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
