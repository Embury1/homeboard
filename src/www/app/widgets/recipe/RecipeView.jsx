import React, { Component } from 'react';

import Recipe from './Recipe.jsx';
import styles from './RecipeView.css';

const EMPTY_RECIPE = { name: '', servings: 1, time: 0, ingredients: [], instructions: '' };

class RecipeView extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    recipes: [],
	    currentRecipe: EMPTY_RECIPE,
	    adjustedServings: 0
	};
    }

    componentDidMount() {
	this.props.recipesSocket.on('saved:recipe', (savedRecipe) => {
	    const recipes = [...this.state.recipes];
	    // Replace recipe or push to end if it's new.
	    recipes[~(~_.findIndex(recipes, { _id: savedRecipe._id }) || ~recipes.length)] = savedRecipe;
	    const currentRecipe = this.state.currentRecipe._id === savedRecipe._id ? savedRecipe : this.state.currentRecipe;
	    this.setState({ recipes, currentRecipe });
	});

	this.props.recipesSocket.on('deleted:recipe', (deletedRecipe) => {
	    const recipes = this.state.recipes.filter((recipe) => recipe._id !== deletedRecipe._id);
	    this.setState({ recipes });

	    if (this.state.currentRecipe._id === deletedRecipe._id) {
		const currentRecipe = Object.assign({}, EMPTY_RECIPE);
		this.setState({ currentRecipe });
	    }
	});

	this.props.recipesSocket.emit('get:recipes', (recipes) => {
	    this.setState({ recipes });
	});
    }

    componentWillUnmount() {
	this.props.recipesSocket.off();
    }

    handleCurrentRecipeChange = (event) => {
	const value = event.target.value;
	const currentRecipe = Object.assign({}, EMPTY_RECIPE, this.state.recipes.find((recipe) => recipe._id === value));
	this.setState({ currentRecipe, adjustedServings: currentRecipe.servings });
    };
    
    handleServingsChange = (event) => {
	const adjustedServings = Number(event.target.value);
	this.setState({ adjustedServings });
    };

    handleRandomClick = (event) => {
	const index = _.random(this.state.recipes.length - 1);
	const currentRecipe = this.state.recipes[index];
	this.setState({ currentRecipe, adjustedServings: currentRecipe.servings });
    };

    render() {
	const recipeOptions = this.state.recipes.map((recipe) => {
	    return <option value={recipe._id} key={recipe._id}>{recipe.name}</option>;
	});

	return (
	    <React.Fragment>
		<select name="recipe" value={this.state.currentRecipe._id} onChange={this.handleCurrentRecipeChange}
		    className={styles.recipes}>
		    <option value=""></option>
		    {recipeOptions}
		</select>

		<div className={styles.controls}>
		    <button type="button" onClick={this.handleRandomClick} className={styles.randomize}>Randomize</button>

		    {this.state.currentRecipe._id &&
			<input type="range" min="1" max="10" step="1" value={this.state.adjustedServings} onChange={this.handleServingsChange}
			    className={styles.servings} />
		    }
		</div>

		{this.state.currentRecipe._id &&
		    <Recipe recipe={this.state.currentRecipe} className={styles.preview} servings={this.state.adjustedServings} />
		}
	    </React.Fragment>
	);
    }
}

export { RecipeView };
