import React from 'react';
import ReactMarkdown from 'react-markdown';
import FontAwesome from 'font-awesome/css/font-awesome.css';
import styles from './Recipe.css';

export default function (props) {
    const recipe = props.recipe;
    const ingredients = recipe.ingredients.map((ingredient, index) => {
	return <li key={index}>{ingredient.amount}{ingredient.unit} {ingredient.name}</li>;
    });

    return (
	<div className={props.className}>
	    <h1>{recipe.name || 'No name'}</h1>

	    <i className={[FontAwesome.fa, FontAwesome['fa-cutlery']].join(' ')}></i> 
	    <span className={styles.servings}>{recipe.servings} serving{recipe.servings != 1 && 's'}</span>
	    <i className={[FontAwesome.fa, FontAwesome['fa-hourglass-half']].join(' ')}></i> 
	    <span className={styles.time}>{recipe.time} min</span>

	    <h2>Ingredients</h2>
	    {ingredients.length && <ul>
		{ingredients}
	    </ul> || 'No ingredients'}

	    <h2>Instructions</h2>
	    {recipe.instructions && <ReactMarkdown source={recipe.instructions} escapeHtml={false} />
		|| <p>No instructions</p>}
	</div>
    );
}
