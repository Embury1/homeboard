import io from 'socket.io';
import log from '../log';
import { Device } from './device';

const clients = {};

export default function(io) {
    const nsp = io.of('/devices');

    nsp.on('connect', (socket) => {
	clients[socket.id] = { socket };

	socket.emit('identify', (id) => {
	    log.info('Asked device for identification.');
	    if (!id) {
		Device.create({settings: {refs: []}}, (err, device) => {
		    if (err) return log.error(err);
		    socket.emit('register', device._id);
		    log.info(`Device is not registered. Sent new id ${device._id} to the device.`);
		    clients[socket.id] = Object.assign({}, clients[socket.id], { deviceId: device._id });
		});
	    } else {
		log.info(`Device is registered as ${id}.`);
		clients[socket.id] = Object.assign({}, clients[socket.id], { deviceId: id });
		Device.findById(id, (err, device) => {
		    if (err) return log.error(err);

		    device.connected = new Date();
		    device.save((err) => {
			if (err) return log.error(err);
		    });

		    socket.emit('initialize', device.settings);
		    log.info('Sent settings to the device.');
		});
	    }
	});

	socket.on('disconnect', () => {
	    delete clients[socket.id];
	});

	socket.on('get:list', (cb) => {
	    Device.find({}, (err, devices) => {
		if (err) return log.error(err);
		cb(devices);
		log.info('Responded with list of devices.');
	    });
	});

	socket.on('save:device', (device, cb) => {
	    Device.update({ _id: device._id }, device, (err, res) => {
		if (err) return log.error(err);
		cb(res);
		log.info(`Saved device ${device._id}.`);

		const socketId = Object.keys(clients).find((socketId) => clients[socketId].deviceId === device._id);
		if (socketId) {
		    const client = clients[socketId];
		    client.socket.emit('initialize', device.settings);
		    log.info('Updated the device.');
		}
	    });
	});
    });
};

