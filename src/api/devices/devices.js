import io from 'socket.io';
import log from '../log';
import { Device } from './device';

export default function(io) {
    const nsp = io.of('/devices');

    nsp.on('connect', (socket) => {
	socket.emit('identify', (id) => {
	    log.info('Asked device for identification.');
	    if (!id) {
		Device.create({settings: {refs: []}}, (err, device) => {
		    if (err) return log.error(err);
		    socket.emit('register', device._id);
		    log.info(`Device is not registered. Sent new id ${device._id} to the device.`);
		});
	    } else {
		log.info(`Device is registered as ${id}.`);
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
    });
};

