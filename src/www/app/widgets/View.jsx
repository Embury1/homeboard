import React, { Component } from 'react';

import FontAwesome from 'font-awesome/css/font-awesome.css';

import { ErrorBoundary } from '../ErrorBoundary.jsx';
import { NotFound } from './notFound/NotFound.jsx';
import * as Widgets from './Widgets';
import styles from './View.css';

const REF_INDEX_KEY = 'refIndex';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refIndex: Number(localStorage.getItem(REF_INDEX_KEY)) || 0,
            loading: true
        };
    }

    componentDidUpdate() {
        const refIndex = Number(localStorage.getItem(REF_INDEX_KEY));
        const maxIndex = this.props.refs.length;

        if (this.state.refIndex >= maxIndex) {
            this.setState({ refIndex: maxIndex - 1 });
        }

        if (this.state.loading) {
            this.setState({ loading: false });
        }
    }

    resolveRef = (ref = 'Placeholder/View') => {
        const [widgetRef, modeRef] = ref.split('/');
        if (!Widgets.hasOwnProperty(widgetRef) || !Widgets[widgetRef].hasOwnProperty(modeRef)) {
            return NotFound;
        }

        return Widgets[widgetRef][modeRef];
    };

    previous = (event) => {
        event.preventDefault();
        const refIndex = Math.max(Number(localStorage.getItem(REF_INDEX_KEY)) - 1, 0);
        localStorage.setItem(REF_INDEX_KEY, refIndex);
        this.setState({ refIndex });
    };

    next = (event) => {
        event.preventDefault();
        const refIndex = Math.min(Number(localStorage.getItem(REF_INDEX_KEY)) + 1, this.props.refs.length - 1);
        localStorage.setItem(REF_INDEX_KEY, refIndex);
        this.setState({ refIndex });
    };

    refSelect = (event) => {
        event.preventDefault();
        const refIndex = event.target.value;
        localStorage.setItem(REF_INDEX_KEY, refIndex);
        this.setState({ refIndex });
    };

    render() {
        const refIndex = this.state.refIndex;
        const ref = this.props.refs[refIndex];
        const Widget = this.resolveRef(ref);
        const navItems = this.props.refs.map((ref, index) => <option value={index} key={index}>{ref.replace(/\//g, ' ')}</option>);

        if (!navItems.length) {
            navItems.push(<option value="-1" key="" disabled>No views selected</option>);
        }

        return (
            this.state.loading && <h2>Loading&hellip;</h2> ||
            <React.Fragment>
                <ErrorBoundary>
                    <Widget {...this.props} />
                </ErrorBoundary>

                <nav className={styles.navBar}>
                    <button className={styles.previous} onClick={this.previous} disabled={!this.props.refs.length || refIndex <= 0}>
                        <i className={`${FontAwesome.fa} ${FontAwesome['fa-angle-left']}`}></i>
                    </button>

                    <select value={refIndex} className={styles.navSelect} onChange={this.refSelect}>
                        {navItems}
                    </select>

                    <button className={styles.next} onClick={this.next} disabled={!this.props.refs.length || refIndex >= (this.props.refs.length - 1)}>
                        <i className={`${FontAwesome.fa} ${FontAwesome['fa-angle-right']}`}></i>
                    </button>
                </nav>
            </React.Fragment>
        );
    }
}

export default View;
