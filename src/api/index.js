import http from 'http';
import https from 'https';
import fs from 'fs';

import express from 'express';
import socketio from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import log from './log';
import devices from './devices/devices';
import recipes from './recipes/recipes';
import vendorProducts from './vendor-products/vendor-products';
import shoppingLists from './shoppingLists/shoppingLists';

const prodEnv = env === 'production';
const app = express();

let server = null;
if (prodEnv) {
    server = https.createServer({
        key: fs.readFileSync(__dirname + '/../cert/serverkey.pem'),
        cert: fs.readFileSync(__dirname + '/../cert/servercert.pem')
    }, app);
} else {
    server = http.createServer(app);
}

const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 8081;
const io = socketio(server, { path: '/ws' });

dotenv.config();

mongoose.connect(process.env.DB_URL, (err) => {
    if (err) return log.error(err);
    log.info('Connected to database.');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

if (prodEnv) {
    app.use(express.static('assets'));
    app.get('/', (req, res) => {
        res.sendFile('assets/index.html');
    });
}

const modules = [ devices, recipes, vendorProducts, shoppingLists ];
for (const mod of modules) {
    app.use('/api', mod(io));
}

app.use((err, req, res, next) => {
    res.status(400).send({ error: err.message });
});

server.listen(port, () => {
    log.info(`Server listening at port ${port}`);
});
