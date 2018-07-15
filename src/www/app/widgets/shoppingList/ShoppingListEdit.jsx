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
			console.log('Received list of shopping list items.', shoppingListItems);
		});

		this.props.shoppingListsSocket.on('saved:shoppingListItems', (updatedItems) => {
			const shoppingListItems = [...this.state.shoppingListItems];
			for (const item of updatedItems) {
				shoppingListItems[~(~_.findIndex(shoppingListItems, { _id: item._id }) || ~shoppingListItems.length)] = item;
			}
			this.setState({ shoppingListItems });
			console.log('Received updated list of shopping list items.', updatedItems);
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

	render() {
		const shoppingListItems = _.orderBy(this.state.shoppingListItems, ['created'], ['desc']).map((item, index) => {
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
