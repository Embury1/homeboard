import React, { Component, Fragment } from 'react';

import FontAwesome from 'font-awesome/css/font-awesome.css';
import Hammer from 'react-hammerjs';

import vars from '../../vars';
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
        this.props.shoppingListsSocket.on('saved:shoppingListItem', (updatedItem) => {
            const items = [...this.state.items];
            items[~(~_.findIndex(items, { _id: updatedItem._id }) || ~items.length)] = updatedItem;
            this.setState({ items });
            console.log('Received updated shopping list item.', updatedItem);
        });

        this.props.shoppingListsSocket.on('deleted:shoppingListItem', (deletedItem) => {
            const items = [..._.reject(this.state.items, (item) => item._id === deletedItem._id)];
            this.setState({ items });
        });

        fetch(`${vars.apiBaseUrl}/api/shoppingListItems`)
            .then((res) => {
                return res.json();
            }).then((items) => {
                this.setState({ items });
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
        this.props.shoppingListsSocket.off();
    }

    toggleItemStatus = (item) => {
        const clickedItem = Object.assign({}, item);
        clickedItem.done = !clickedItem.done;
        fetch(`${vars.apiBaseUrl}/api/shoppingListItems/${clickedItem._id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(clickedItem)
        }).then((res) => {
            return res.json();
        }).then((updatedItem) => {
            // TODO: Confirm save
        }).catch((err) => {
            // TODO: Handle error
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
            fetch(`${vars.apiBaseUrl}/api/shoppingListItems/${pannedItem._id}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(pannedItem)
            }).then((res) => {
                return res.json();
            }).then((deletedItem) => {
                // TODO: Confirm delete
            }).catch((err) => {
                // TODO: Handle error
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
        fetch(`${vars.apiBaseUrl}/api/shoppingListItems`, {
            method: 'POST',
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(newItem)
        }).then((res) => {
            return res.json();
        }).then((savedRecipe) => {
            // TODO: Confirm save
            const newItem = Object.assign({}, EMPTY_ITEM);
            this.setState({ newItem });
        }).catch((err) => {
            // TODO: Handle error
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
                    <p className={styles.item} style={item._id === this.state.pannedItem._id ? { left: this.state.pannedItemOffset } : {}}>
                        <span className={styles.itemName}>{item.amount > 0 ? (item.amount + item.unit) : ''} {item.name}</span>
                        {item.done && <i className={[styles.itemCheck, FontAwesome.fa, FontAwesome['fa-check']].join(' ')}></i>}
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
