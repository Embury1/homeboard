import React, { Component } from 'react';

class RecipeEdit extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    currentRecipe: {},
	    recipes: [
		'köttbullar & potatismos',
		'pannkakor',
		'köttfärssås & spaghetti',
		'tacos'
	    ]
	};
    }

    render() {
	const recipeOptions = this.state.recipes.map((recipe) => {
	    return (
		<option value={recipe} key={recipe}>{recipe}</option>
	    );
	});

	return (
	    <select value={this.state.currentRecipe}>
		{recipeOptions}
	    </select>
	);
    }
}

export { RecipeEdit };
