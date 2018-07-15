import log from '../log';
import { ShoppingListItem } from './shoppingListItem';

export default function (io) {
    const nsp = io.of('/shoppingLists');

    nsp.on('connect', (socket) => {
        socket.on('create:shoppingListItems', (items, cb) => {
            ShoppingListItem.insertMany(items.map((item) => {
                delete item._id;
                return item;
            }), (err, createdItems) => {
                if (err) return log.error(err);
                cb(createdItems);
                log.info('Created shopping list items.', createdItems);
                nsp.emit('saved:shoppingListItems', createdItems);
            });
        });

        socket.on('get:shoppingListItems', (cb) => {
            ShoppingListItem.find({}, (err, shoppingListItems) => {
                if (err) return log.error(err);
                cb(shoppingListItems);
                log.info('Responded with list of shopping list items.');
            });
        });

        socket.on('save:shoppingListItem', (item, cb) => {
            if (!item) return;
            ShoppingListItem.findByIdAndUpdate(item._id, item, { new: true }, (err, updatedItem) => {
                if (err) return log.error(err);
                if (!updatedItem) return;
                cb(updatedItem);
                log.info(`Saved shopping list item ${item._id}.`);
                nsp.emit('saved:shoppingListItems', [updatedItem]);
            });
        });

        socket.on('delete:shoppingListItem', (item, cb) => {
            if (!item || !item._id) return;
            ShoppingListItem.findByIdAndRemove(item._id, (err, deletedItem) => {
                if (err) return log.error(err);
                if (!deletedItem) return;
                cb(deletedItem);
                log.info(`Deleted shopping list item ${deletedItem._id}.`);
                nsp.emit('deleted:shoppingListItem', deletedItem);
            });
        });
    });
}