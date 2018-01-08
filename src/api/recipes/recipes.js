import io from 'socket.io';
import log from '../log';
import { Recipe } from './recipe';

const clients = {};

export default function(io) {
    const nsp = io.of('/recipes');

    nsp.on('connect', (socket) => {
	clients[socket.id] = { socket };
	
	socket.on('get:recipes', (cb) => {
	    Recipe.find({}, (err, recipes) => {
		if (err) return log.error(err);
		cb(recipes);
		log.info('Responded with list of recipes.');
	    });
	});

	socket.on('save:recipe', (recipe, cb) => {
	    if (!recipe) return;
	    if (!recipe._id) {
		Recipe.create(recipe, (err, newRecipe) => {
		    if (err) return log.error(err);
		    if (!newRecipe) return;
		    cb(newRecipe);
		    log.info(`Created recipe ${newRecipe._id}.`);
		    nsp.emit('saved:recipe', newRecipe);
		});
	    } else {
		Recipe.findByIdAndUpdate(recipe._id, recipe, { new: true }, (err, updatedRecipe) => {
		    if (err) return log.error(err);
		    if (!updatedRecipe) return;
		    cb(updatedRecipe);
		    log.info(`Saved recipe ${recipe._id}.`);
		    nsp.emit('saved:recipe', updatedRecipe);
		});
	    }
	});
	
	socket.on('delete:recipe', (recipe, cb) => {
	    if (!recipe || !recipe._id) return;
	    Recipe.findByIdAndRemove(recipe._id, (err, deletedRecipe) => {
		if (err) return log.error(err);
		if (!deletedRecipe) return;
		cb(deletedRecipe);
		log.info(`Deleted recipe ${deletedRecipe._id}.`);
		nsp.emit('deleted:recipe', deletedRecipe);
	    });
	});
    });
}
