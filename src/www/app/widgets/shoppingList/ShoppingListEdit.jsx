import React, { Component, Fragment } from 'react';

import ReactMarkdown from 'react-markdown';
import FontAwesome from 'font-awesome/css/font-awesome.css';

import styles from './ShoppingListEdit.css';

class ShoppingListEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shoppingListItems: []
		};
	}

	componentDidMount() {
		this.props.shoppingListsSocket.emit('get:shoppingListItems', (shoppingListItems) => {
			this.setState({ shoppingListItems });
		});

		this.props.shoppingListsSocket.on('saved:shoppingListItem', (updatedItem) => {
			const shoppingListItems = [...this.state.shoppingListItems];
			shoppingListItems[_.findIndex(shoppingListItems, { _id: updatedItem._id })] = updatedItem;
			this.setState({ shoppingListItems });
		});
	}

	toggleItemStatus = (item) => {
		const clickedItem = Object.assign({}, item);
		clickedItem.done = !clickedItem.done;
		this.props.shoppingListsSocket.emit('save:shoppingListItem', clickedItem, (updatedItem) => {
			console.log('Toggled shopping list item.', updatedItem);
		});
	};

	render() {
		const shoppingListItems = this.state.shoppingListItems.map((item, index) => {
			return (
				<p className={styles.item} onClick={() => this.toggleItemStatus(item)} key={index}>
					<span className={styles.itemName}>{item.amount}{item.unit} {item.name}</span>
					{ item.done && <i className={[styles.itemCheck, FontAwesome.fa, FontAwesome['fa-check']].join(' ')}></i> }
				</p>
			);
		});

		return (
			<Fragment>
				{shoppingListItems}
			</Fragment>
		);
	}
}

export { ShoppingListEdit };
