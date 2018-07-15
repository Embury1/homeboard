import React, { Component, Fragment } from 'react';

import FontAwesome from 'font-awesome/css/font-awesome.css';
import Hammer from 'react-hammerjs';

import styles from './ShoppingListEdit.css';

class ShoppingListEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			pannedItemOffset: 0,
			pannedItem: {}
		};
	}

	componentDidMount() {
		this.props.shoppingListsSocket.emit('get:shoppingListItems', (items) => {
			this.setState({ items });
			console.log('Received list of shopping list items.', items);
		});

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

	render() {
		const shoppingListItems = _.orderBy(this.state.items, ['created'], ['desc']).map((item, index) => {
			return (
				<Hammer key={index} onTap={() => this.toggleItemStatus(item)} onPanStart={() => this.panStart(item)} onPan={this.pan} onPanEnd={this.panEnd} direction="DIRECTION_RIGHT">
					<p className={styles.item} style={item._id === this.state.pannedItem._id ? {left: this.state.pannedItemOffset} : {}}>
						<span className={styles.itemName}>{item.amount}{item.unit} {item.name}</span>
						{ item.done && <i className={[styles.itemCheck, FontAwesome.fa, FontAwesome['fa-check']].join(' ')}></i> }
					</p>
				</Hammer>
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
