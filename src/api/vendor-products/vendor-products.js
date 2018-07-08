import io from 'socket.io';
import log from '../log';
import { VendorProduct, Vendor } from './VendorProduct';
import { Product } from './Product';

const clients = {};

export default function (io) {
	const nsp = io.of('/vendorProducts');

	nsp.on('connect', (socket) => {
		clients[socket.id] = { socket };

		socket.on('get:vendors', (cb) => {
			Vendor.find({}, (err, vendors) => {
				if (err) return log.error(err);
				cb(vendors);
				log.info('Responded with list of vendors.');
			});
		});

		socket.on('get:products', (cb) => {
			Product.find({}, (err, products) => {
				if (err) return log.error(err);
				cb(products);
				log.info('Responded with list of products.');
			});
		});
	});
}
