import { Router } from 'express';

import log from '../log';
import { ShoppingListItem } from './shoppingListItem';

export default function (io) {
    const nsp = io.of('/shoppingLists');
	const router = Router();

    router.post('/shoppingListItems', (req, res, next) => {
        const item = req.body;
        delete item._id;
        ShoppingListItem.create(item, (err, createdItem) => {
            if (err) return next(err);
            res.send(createdItem);
            log.info('Created shopping list item.', createdItem);
            nsp.emit('saved:shoppingListItem', createdItem);
        });
    });

    router.get('/shoppingListItems', (req, res, next) => {
        ShoppingListItem.find({}, (err, shoppingListItems) => {
            if (err) return next(err);
            res.send(shoppingListItems);
            log.info('Responded with list of shopping list items.');
        });
    });

    router.patch('/shoppingListItems/:itemId', (req, res, next) => {
        const itemId = req.params.itemId;
        const item = req.body;
        ShoppingListItem.findByIdAndUpdate(itemId, item, { new: true }, (err, updatedItem) => {
            if (err) return next(err);
            if (!updatedItem) return res.sendStatus(404);
            res.send(updatedItem);
            log.info(`Saved shopping list item ${item._id}.`);
            nsp.emit('saved:shoppingListItem', updatedItem);
        });
    });

    router.delete('/shoppingListItems/:itemId', (req, res, next) => {
        const itemId = req.params.itemId;
        ShoppingListItem.findByIdAndRemove(itemId, (err, deletedItem) => {
            if (err) return next(err);
            if (!deletedItem) return res.sendStatus(404);
            res.send(deletedItem);
            log.info(`Deleted shopping list item ${deletedItem._id}.`);
            nsp.emit('deleted:shoppingListItem', deletedItem);
        });
    });

    return router;
}