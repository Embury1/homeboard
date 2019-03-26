import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import FontAwesome from 'font-awesome/css/font-awesome.css';

import styles from './Select.css';

class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            filterText: ''
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.close, true);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.close, true);
    }

    select = (value) => {
        this.props.onValue(value);
        this.setState({ isOpen: false, filterText: '' });
    };

    filter = (event) => {
        const filterText = event.target.value;
        this.setState({ filterText });
        this.props.onValue('');
    };

    open = () => {
        this.setState({ isOpen: true });
    };

    close = (event) => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.setState({ isOpen: false });
            if (this.state.filterText) {
                this.props.onValue(this.state.filterText);
                this.setState({ filterText: '' });
            }
        }
    };

    toggle = () => {
        const isOpen = !this.state.isOpen;
        this.setState({ isOpen });
    };

    render() {
        const items = [
            ..._.filter(this.props.items, (item) => {
                return item.text.toLowerCase().includes(this.state.filterText.toLowerCase());
            })
        ];
        const selectItems = items.map((item) => {
            return <li 
                key={item.key}
                className={styles.item}
                onClick={() => this.select(item.value)}
            >
                {item.text}
            </li>
        });

        const iconClass = this.state.isOpen
            ? 'fa-caret-up'
            : 'fa-caret-down';

        return (
            <div className={`${styles.flexContainer} ${this.props.className}`}>
                <div className={`${styles.backdrop} ${this.state.isOpen && styles.open || ''}`} onClick={this.open}>
                    <input type="text"
                        name="search"
                        value={this.state.filterText || this.props.value} 
                        onFocus={this.open}
                        onChange={this.filter}
                        className={styles.search}
                    />
                    <i 
                        className={`${styles.icon} ${FontAwesome.fa} ${FontAwesome[iconClass]}`}
                    />
                </div>
                <ul style={!this.state.isOpen ? {display: 'none'} : {}} className={styles.items}>
                    {selectItems.length ? selectItems : <li className={styles.item}>No matches</li>}
                </ul>
            </div>
        );
    }
}

export { Select };