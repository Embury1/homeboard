import io from 'socket.io';
import log from '../log';
import { Device } from './device';

export default function(io) {
    const nsp = io.of('/devices');

    nsp.on('connect', (socket) => {
	socket.emit('identify', (id) => {
	    log.info('Asked device for identification.');
	    if (!id) {
		Device.create({}, (err, device) => {
		    if (err) return log.error(err);
		    socket.emit('register', device._id);
		    log.info(`Device is not registered. Sent new id ${device._id} to the device.`);
		});
	    } else {
		log.info(`Device is registered as ${id}.`);
	    }
	});
    });
};

