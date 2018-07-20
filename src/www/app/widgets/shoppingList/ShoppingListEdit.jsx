import React, { Component, Fragment } from 'react';

import FontAwesome from 'font-awesome/css/font-awesome.css';
import Hammer from 'react-hammerjs';

import styles from './ShoppingListEdit.css';
import { Select } from '../../shared/select/Select.jsx';

const EMPTY_ITEM = { amount: 0, unit: '', name: '' };

class ShoppingListEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newItem: EMPTY_ITEM,
			items: [],
			products: [],
			pannedItemOffset: 0,
			pannedItem: {}
		};
	}

	componentDidMount() {
		this.props.shoppingListsSocket.on('saved:shoppingListItems', (updatedItems) => {
			const items = [...this.state.items];
			for (const updatedItem of updatedItems) {
				items[~(~_.findIndex(items, { _id: updatedItem._id }) || ~items.length)] = updatedItem;
			}
			this.setState({ items });
			console.log('Received updated list of shopping list items.', updatedItems);
		});

		this.props.shoppingListsSocket.on('deleted:shoppingListItem', (deletedItem) => {
			const items = [..._.reject(this.state.items, (item) => item._id === deletedItem._id)];
			this.setState({ items });
		});

		this.props.shoppingListsSocket.emit('get:shoppingListItems', (items) => {
			this.setState({ items });
			console.log('Received list of shopping list items.', items);
		});

		this.props.vendorProductsSocket.emit('get:products', (products) => {
			this.setState({ products });
		});
	}

	componentWillUnmount() {
		this.props.shoppingListsSocket.off();
	}

	toggleItemStatus = (item) => {
		const clickedItem = Object.assign({}, item);
		clickedItem.done = !clickedItem.done;
		this.props.shoppingListsSocket.emit('save:shoppingListItem', clickedItem, (updatedItem) => {
			console.log('Toggled shopping list item.', updatedItem);
		});
	};

	panStart = (item) => {
		const pannedItem = Object.assign({}, item);
		this.setState({ pannedItem });
	};

	pan = (event) => {
		const pannedItemOffset = event.deltaX;
		this.setState({ pannedItemOffset });
	};

	panEnd = () => {
		if (this.state.pannedItemOffset >= (window.innerWidth / 2)) {
			const pannedItem = Object.assign({}, this.state.pannedItem);
			this.props.shoppingListsSocket.emit('delete:shoppingListItem', pannedItem, (deletedItem) => {
				console.log('Deleted shopping list item.', deletedItem);
			});
		}
		this.setState({
			pannedItemOffset: window.outerWidth,
			pannedItem: {}
		});
	};

	itemChange = (event) => {
		const prop = event.target.name;
		const value = event.target.value;
		const newItem = Object.assign({}, this.state.newItem, { [prop]: value });
		this.setState({ newItem });
	};

	selectChange = (value) => {
		const newItem = Object.assign({}, this.state.newItem, { name: value });
		this.setState({ newItem });
	};

	addNewItem = (event) => {
		event.preventDefault();
		const newItem = Object.assign({}, this.state.newItem);
		if (!newItem.name) return;
		this.props.shoppingListsSocket.emit('create:shoppingListItems', [newItem], (savedItems) => {
			console.log('Added shopping list item.', savedItems[0]);
			const newItem = Object.assign({}, EMPTY_ITEM);
			this.setState({ newItem, newItem });
		});
	};

	resetNewItem = () => {
		const newItem = Object.assign({}, EMPTY_ITEM);
		this.setState({ newItem });
	};

	render() {
		const shoppingListItems = _.orderBy(this.state.items, ['created'], ['desc']).map((item, index) => {
			return (
				<Hammer key={index} onTap={() => this.toggleItemStatus(item)} onPanStart={() => this.panStart(item)} onPan={this.pan} onPanEnd={this.panEnd} direction="DIRECTION_RIGHT">
					<p className={styles.item} style={item._id === this.state.pannedItem._id ? {left: this.state.pannedItemOffset} : {}}>
						<span className={styles.itemName}>{item.amount > 0 ? (item.amount + item.unit) : ''} {item.name}</span>
						{ item.done && <i className={[styles.itemCheck, FontAwesome.fa, FontAwesome['fa-check']].join(' ')}></i> }
					</p>
				</Hammer>
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
			<Fragment>
				<form name="quickAdd" onSubmit={this.addNewItem} className={styles.newItem} autoComplete="off">
					<input autoComplete="off" name="hidden" type="text" style={{ display: 'none' }} />
					<Select
						items={productItems}
						onValue={this.selectChange}
						value={this.state.newItem.name}
						tabIndex={0}
						className={styles.newItemProduct}
					></Select>

					<button type="submit" className={styles.addNewItem} onClick={this.addNewItem}>
						<i className={[FontAwesome.fa, FontAwesome['fa-plus']].join(' ')}></i>
					</button>
					<button type="button" className={styles.resetNewItem} onClick={this.resetNewItem}>
						<i className={[FontAwesome.fa, FontAwesome['fa-times']].join(' ')}></i>
					</button>
				</form>
				{shoppingListItems}
			</Fragment>
		);
	}
}

export { ShoppingListEdit };
