import React, { Component } from 'react';

import styles from './RecipeEdit.css';
import Recipe from './Recipe.jsx';

const EMPTY_RECIPE = { name: '', servings: 1, time: 0, ingredients: [], instructions: '' };
const EMPTY_INGREDIENT = { amount: 0, unit: '', name: '' };

class RecipeEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentRecipe: EMPTY_RECIPE,
			newIngredient: EMPTY_INGREDIENT,
			products: [],
			recipes: []
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
		});

		this.props.recipesSocket.emit('get:recipes', (recipes) => {
			this.setState({ recipes });
		});

		this.props.vendorProductsSocket.emit('get:products', (products) => {
			this.setState({ products });
		});
	}

	componentWillUnmount() {
		this.props.recipesSocket.off();
	}

	handleRecipeSelectionChange = (event) => {
		const currentRecipe = Object.assign({}, EMPTY_RECIPE, this.state.recipes.find((recipe) => recipe._id === event.target.value));
		this.setState({ currentRecipe });
	};

	handleSubmit = (event) => {
		this.props.recipesSocket.emit('save:recipe', this.state.currentRecipe, (recipe) => {
			console.log('Saved recipe.', recipe);
			if (!this.state.currentRecipe._id) {
				this.reset();
			}
		});
		event.preventDefault();
	};

	handleCancel = (event) => {
		this.reset();
	};

	handleDelete = (event) => {
		const recipe = this.state.currentRecipe;
		if (!recipe._id) return;
		if (window.confirm(`Delete recipe '${recipe.name}'?`)) {
			this.props.recipesSocket.emit('delete:recipe', recipe, (deletedRecipe) => {
				console.log('Deleted recipe.', deletedRecipe);
				const currentDevice = Object.assign({}, EMPTY_RECIPE);
				// TODO: Somehow this doesn't reset the input fields.
				this.setState({ currentDevice });
			});
		}
	};

	handleChange = (event) => {
		const prop = event.target.name;
		const value = event.target.value;
		const currentRecipe = Object.assign({}, this.state.currentRecipe, { [prop]: value });
		this.setState({ currentRecipe });
	};

	handleIngredientChange = (event) => {
		const prop = event.target.name;
		const value = event.target.value;
		const newIngredient = Object.assign({}, this.state.newIngredient, { [prop]: value });
		this.setState({ newIngredient });
	};

	handleAddIngredient = (event) => {
		const currentRecipe = Object.assign({}, this.state.currentRecipe);
		currentRecipe.ingredients = [...currentRecipe.ingredients, this.state.newIngredient];
		const newIngredient = Object.assign({}, EMPTY_INGREDIENT);
		this.setState({ currentRecipe, newIngredient });
	};

	handleRemoveIngredient = (ingredient) => {
		const currentRecipe = Object.assign({}, this.state.currentRecipe);
		currentRecipe.ingredients = [..._.without(currentRecipe.ingredients, ingredient)];
		this.setState({ currentRecipe });
	};

	reset = () => {
		const selectedRecipe = this.state.recipes.find((recipe) => recipe._id === this.state.currentRecipe._id);
		const currentRecipe = Object.assign({}, EMPTY_RECIPE, selectedRecipe);
		this.setState({ currentRecipe });
	};

	isDirty = () => {
		const selectedRecipe = this.state.recipes.find((recipe) => recipe._id === this.state.currentRecipe._id);
		const pristine = Object.assign({}, EMPTY_RECIPE, selectedRecipe);
		return _.isEqual(pristine, this.state.currentRecipe);
	};

	render() {
		const recipeOptions = this.state.recipes.map((recipe) => {
			return <option value={recipe._id} key={recipe._id}>{recipe.name}</option>;
		});

		const ingredients = this.state.currentRecipe.ingredients.map((ingredient, index) => {
			return (
				<div className={styles.recipeIngredientRow} key={index}>
					<div className={styles.recipeIngredient}>
						{ingredient.amount}{ingredient.unit} {ingredient.name}
					</div>

					<div className={styles.removeRecipeIngredient}>
						<button type="button" className={styles.btn} onClick={() => this.handleRemoveIngredient(ingredient)}>-</button>
					</div>
				</div>
			);
		});

		const productOptions = _.sortBy(this.state.products, [(p) => p._id]).map((product) => {
			return <option value={product._id} key={product._id}>{product._id}</option>;
		});

		return (
			<div>
				<form name="recipeForm" onSubmit={this.handleSubmit} className={styles.row}>
					<div className={styles.recipeDetailsColumn}>
						<select value={this.state.currentRecipe._id} onChange={this.handleRecipeSelectionChange} className={styles.recipes}>
							<option value="">New recipe</option>
							{recipeOptions}
						</select>

						<input type="text" name="name" value={this.state.currentRecipe.name} onChange={this.handleChange}
							className={styles.recipeName} placeholder="Recipe name" />

						<div className={styles.row}>
							<input type="number" name="servings" value={this.state.currentRecipe.servings} onChange={this.handleChange}
								className={styles.servings} step="1" min="1" max="20" placeholder="Servings" />

							<input type="text" name="time" value={this.state.currentRecipe.time} onChange={this.handleChange}
								className={styles.time} placeholder="Time" />
						</div>

						<h3>Ingredients</h3>
						{ingredients}

						<div className={styles.newIngredient}>
							<div className={styles.newIngredientMeasure}>
								<input type="number" name="amount" value={this.state.newIngredient.amount} className={styles.newIngredientAmount}
									onChange={this.handleIngredientChange} step="1" min="0" max="999.99" placeholder="Amount" />

								<input type="text" name="unit" value={this.state.newIngredient.unit} className={styles.newIngredientUnit}
									onChange={this.handleIngredientChange} placeholder="Unit" />
							</div>

							<select name="name" value={this.state.newIngredient.name} className={styles.newIngredientProduct}
								onChange={this.handleIngredientChange}>
								<option value=""></option>
								{productOptions}
							</select>

							<button type="button" className={styles.addNewIngredient} onClick={this.handleAddIngredient}>+</button>
						</div>
					</div>

					<div className={styles.instructionsColumn}>
						<textarea name="instructions" value={this.state.currentRecipe.instructions} onChange={this.handleChange}
							className={styles.instructions} placeholder="Instructions" />

						<button type="submit" disabled={this.isDirty()} className={styles.save}>Save</button>
						<button type="button" onClick={this.handleCancel} disabled={this.isDirty()} className={styles.cancel}>Cancel</button>
						<button type="button" onClick={this.handleDelete} disabled={!this.state.currentRecipe._id} className={styles.delete}>Delete</button>
					</div>

					<div className={styles.previewColumn}>
						<Recipe recipe={this.state.currentRecipe} className={styles.preview} />
					</div>
				</form>
			</div>
		);
	}
}

export { RecipeEdit };
