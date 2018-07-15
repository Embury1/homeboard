import React from 'react';
import PropTypes from 'prop-types';

import ReactMarkdown from 'react-markdown';
import FontAwesome from 'font-awesome/css/font-awesome.css';

import styles from './Recipe.css';

Recipe.propTypes = {
	recipe: PropTypes.object.isRequired,
	servings: PropTypes.number
};

export default function Recipe(props) {
	const recipe = props.recipe;
	const servings = props.servings || recipe.servings;

	const ingredients = recipe.ingredients.map((ingredient, index) => {
		const amount = ingredient.amount / recipe.servings * servings;
		return (
			<li key={index}
				{...(props.onAdd && {onClick: () => props.onAdd([ingredient])})}
				className={props.onAdd ? `${styles.addable} ${styles.ingredient}` : styles.ingredient}
			>
				{amount}{ingredient.unit} {ingredient.name}
			</li>
		);
	});

	return (
		<div className={props.className}>
			<h1>{recipe.name || 'No name'}</h1>

			<i className={[FontAwesome.fa, FontAwesome['fa-cutlery']].join(' ')}></i>
			<span className={styles.servings}>{servings} serving{servings !== 1 && 's'}</span>
			<i className={[FontAwesome.fa, FontAwesome['fa-hourglass-half']].join(' ')}></i>
			<span className={styles.time}>{recipe.time} min</span>

			<h2>Ingredients {props.onAdd && <i className={[styles.addAllIngredients, FontAwesome.fa, FontAwesome['fa-plus']].join(' ')} onClick={() => props.onAdd(recipe.ingredients)}></i>}</h2>
			{ingredients.length && <ul className={styles.ingredients}>
				{ingredients}
			</ul> || 'No ingredients'}

			<h2>Instructions</h2>
			{recipe.instructions && <ReactMarkdown source={recipe.instructions} escapeHtml={false} />
				|| <p>No instructions</p>}
		</div>
	);
}
