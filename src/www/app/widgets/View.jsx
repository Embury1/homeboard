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
            refIndex: 0,
            loading: true
        };
    }

    componentDidUpdate() {
        const refIndex = Number(localStorage.getItem(REF_INDEX_KEY));
        const maxIndex = this.props.refs.length;

        if (refIndex >= maxIndex) {
            localStorage.setItem(REF_INDEX_KEY, maxIndex - 1);
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

    previous = () => {
        const refIndex = Math.max(Number(localStorage.getItem(REF_INDEX_KEY)) - 1, 0);
        localStorage.setItem(REF_INDEX_KEY, refIndex);
        this.setState({ refIndex });
    };

    next = () => {
        const refIndex = Math.min(Number(localStorage.getItem(REF_INDEX_KEY)) + 1, this.props.refs.length - 1);
        localStorage.setItem(REF_INDEX_KEY, refIndex);
        this.setState({ refIndex });
    };

    render() {
        const refIndex = Math.max(Math.min(Number(localStorage.getItem(REF_INDEX_KEY)), this.props.refs.length - 1), 0);
        const ref = this.props.refs[refIndex];
        const Widget = this.resolveRef(ref);

        return (
            this.state.loading && <h2>Loading&hellip;</h2> ||
            <React.Fragment>
                {this.props.refs.length > 1 && refIndex > 0 &&
                    <div className={styles.previous} onClick={this.previous}>
                        <i className={[FontAwesome.fa, FontAwesome['fa-angle-left']].join(' ')}></i>
                    </div>
                }

                <ErrorBoundary>
                    <Widget {...this.props} />
                </ErrorBoundary>

                {this.props.refs.length > 1 && refIndex < (this.props.refs.length - 1) &&
                    <div className={styles.next} onClick={this.next}>
                        <i className={[FontAwesome.fa, FontAwesome['fa-angle-right']].join(' ')}></i>
                    </div>
                }
            </React.Fragment>
        );
    }
}

export default View;
