import http from 'http';
import express from 'express';
import devices from './devices/devices';
import recipes from './recipes/recipes';
import socketio from 'socket.io';
import mongoose from 'mongoose';
import log from './log';
import dotenv from 'dotenv';

const app = express();
const server = http.createServer(app);
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 8081;

const io = socketio(server, {path: '/ws'});

dotenv.config();

mongoose.connect(process.env.DB_URL, (err) => {
    if (err) return log.error(err);
    log.info('Connected to database.');
});

devices(io);
recipes(io);

if (env === 'production') {
    app.use(express.static('assets'));
    app.get('/', (req, res) => {
        res.sendFile('assets/index.html');
    });
}

server.listen(port, () => {
    log.info(`Server listening at port ${port}`);
});
