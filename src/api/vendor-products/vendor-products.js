import { Router } from 'express';

import log from '../log';
import { Vendor } from './VendorProduct';
import { Product } from './Product';

export default function (io) {
    const nsp = io.of('/vendorProducts');
    const router = Router();

    router.get('/vendors', (req, res, next) => {
        Vendor.find({}, (err, vendors) => {
            if (err) return next(err);
            res.send(vendors);
            log.info('Responded with list of vendors.');
        });
    });

    router.get('/products', (req, res, next) => {
        Product.find({}, (err, products) => {
            if (err) return next(err);
            res.send(products);
            log.info('Responded with list of products.');
        });
    });

    return router;
}
