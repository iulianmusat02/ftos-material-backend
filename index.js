const express = require('express');
const app = express();
const routes = require('./resources/routes.js');
const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes)
app.listen(3000, () => {
    console.log('listening on 3000');
})