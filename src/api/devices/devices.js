import { Router } from 'express';

import log from '../log';
import { Device } from './device';

const clients = {};

export default function (io) {
    const nsp = io.of('/devices');
    const router = Router();

    nsp.on('connect', (socket) => {
        const socketId = socket.id;
        clients[socketId] = { socket };

        socket.on('register:device', (deviceId) => {
            clients[socketId] = Object.assign({}, clients[socketId], { deviceId });
            Device.findByIdAndUpdate(deviceId, { connected: new Date() }, (err, device) => {
                if (err) log.error(`Failed to save field 'connected' for device ${deviceId}.`, err);
            });
        });

        socket.on('disconnect', () => {
            delete clients[socketId];
        });
    });

    router.get('/devices', (req, res, next) => {
        Device.find({}, (err, devices) => {
            if (err) return next(err);
            res.send(devices);
            log.info('Responded with list of devices.');
        });
    });

    router.get('/devices/:deviceId', (req, res, next) => {
        const deviceId = req.params.deviceId;
        Device.findById(deviceId, (err, device) => {
            if (err) return next(err);
            res.send(device);
            log.info(`Responded with device ${device._id}.`);
        });
    });

    router.post('/devices', (req, res, next) => {
        Device.create({ settings: { refs: [] } }, (err, createdDevice) => {
            if (err) return next(err);
            res.send(createdDevice);
            log.info(`Created new device ${createdDevice._id}.`);
        });
    });

    router.patch('/devices/:deviceId', (req, res, next) => {
        const deviceId = req.params.deviceId;
        const device = req.body;
        Device.findByIdAndUpdate(deviceId, device, { new: true }, (err, updatedDevice) => {
            if (err) return next(err);
            res.send(updatedDevice);
            log.info(`Saved device ${updatedDevice._id}.`);

            // TODO: Do this in a better way.
            const socketId = Object.keys(clients).find((socketId) => clients[socketId].deviceId === deviceId);
            if (socketId) {
                const client = clients[socketId];
                client.socket.emit('update:deviceSettings', updatedDevice.settings);
                log.info('Updated the device.');
            }
        });
    });

    return router;
};

