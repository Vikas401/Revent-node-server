require('./modals/User');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middlewares/requireAuth');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(authRoutes);


const mongoUri = 'mongodb+srv://vikas:NiZ3xEGM8emgBUeP@cluster0-zpfmz.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mango instance', err);
})

app.get('/', requireAuth, (req, res) => {
    res.send(`Your Email: ${req.user.email}`);
});

app.listen(9999, () =>{
    console.log('listening on port 9999');
    
})