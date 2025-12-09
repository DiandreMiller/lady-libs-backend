//app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());


app.get('/', (_request, response) => {
    response.send('Welcome to Lady Libs Api!')
});

app.use((_request, response) => {
    response.status(404).json({ error: 'Not Found '})
});

module.exports = app;