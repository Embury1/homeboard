import React, { Component } from 'react';

import vars from '../../vars';
import styles from './RecipeEdit.css';
import Recipe from './Recipe.jsx';
import { Select } from '../../shared/select/Select.jsx';

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

        fetch(`${vars.apiBaseUrl}/api/recipes`)
            .then((res) => {
                return res.json();
            }).then((recipes) => {
                this.setState({ recipes });
            }).catch((err) => {
                // TODO: Handle error
            });

        fetch(`${vars.apiBaseUrl}/api/products`)
            .then((res) => {
                return res.json();
            }).then((products) => {
                this.setState({ products });
            }).catch((err) => {
                // TODO: Handle error
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
        const recipe = Object.assign({}, this.state.currentRecipe);
        fetch(`${vars.apiBaseUrl}/api/recipes`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(recipe)
        }).then((res) => {
            return res.json();
        }).then((savedRecipe) => {
            // TODO: Confirm save
            if (!this.state.currentRecipe._id) {
                this.reset();
            }
        }).catch((err) => {
            // TODO: Handle error
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
            fetch(`${vars.apiBaseUrl}/api/recipes/${recipe._id}`, {
                method: 'DELETE'
            }).then((res) => {
                return res.json();
            }).then((deletedRecipe) => {
                // TODO: Confirm delete
                const currentRecipe = Object.assign({}, EMPTY_RECIPE);
                this.setState({ currentRecipe });
            }).catch((err) => {
                // TODO: Handle error
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

    selectChange = (value) => {
        const newIngredient = Object.assign({}, this.state.newIngredient, { name: value });
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

        const productItems = _.sortBy(this.state.products, [(p) => p._id]).map((product) => {
            return {
                key: product._id,
                value: product._id,
                text: product._id
            };
        });

        return (
            <div>
                <form name="recipeForm" onSubmit={this.handleSubmit} className={styles.flexContainer} autoComplete="off">
                    <div className={styles.recipeDetailsColumn}>
                        <select value={this.state.currentRecipe._id} onChange={this.handleRecipeSelectionChange} className={styles.recipes}>
                            <option value="">New recipe</option>
                            {recipeOptions}
                        </select>

                        <input type="text" name="name" value={this.state.currentRecipe.name} onChange={this.handleChange}
                            className={styles.recipeName} placeholder="Recipe name" />

                        <div className={styles.flexContainer}>
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

                            <Select
                                items={productItems}
                                onValue={this.selectChange}
                                value={this.state.newIngredient.name}
                                tabIndex={6}
                                className={styles.newIngredientProduct}
                            ></Select>

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
