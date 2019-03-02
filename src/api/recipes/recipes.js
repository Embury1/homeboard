import {inspect} from 'util';
import { Router } from 'express';

import log from '../log';
import { Recipe } from './recipe';

export default function (io) {
	const nsp = io.of('/recipes');
	const router = Router();

	router.get('/recipes', (req, res, next) => {
		Recipe.find({}, (err, recipes) => {
			if (err) return next(err);
			res.send(recipes);
			log.info('Responded with list of recipes.');
		});
	});

	router.put('/recipes', (req, res, next) => {
		const recipe = req.body;
		if (!recipe._id) {
			Recipe.create(recipe, (err, newRecipe) => {
				if (err) return next(err);
				res.send(newRecipe);
				log.info(`Created recipe ${newRecipe._id}.`);
				nsp.emit('saved:recipe', newRecipe);
			});
		} else {
			Recipe.findByIdAndUpdate(recipe._id, recipe, { new: true }, (err, updatedRecipe) => {
				if (err) return next(err);
				if (!updatedRecipe) return res.sendStatus(404);
				res.send(updatedRecipe);
				log.info(`Saved recipe ${recipe._id}.`);
				nsp.emit('saved:recipe', updatedRecipe);
			});
		}
	});

	router.delete('/recipes/:recipeId', (req, res, next) => {
		const recipeId = req.params.recipeId;
		Recipe.findByIdAndRemove(recipeId, (err, deletedRecipe) => {
			if (err) return next(err);
			if (!deletedRecipe) return res.sendStatus(404);
			res.send(deletedRecipe);
			log.info(`Deleted recipe ${deletedRecipe._id}.`);
			nsp.emit('deleted:recipe', deletedRecipe);
		});
	});

	return router;
}
