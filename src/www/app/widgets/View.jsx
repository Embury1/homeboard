import React, { Component } from 'react';

import FontAwesome from 'font-awesome/css/font-awesome.css';

import { ErrorBoundary } from '../ErrorBoundary.jsx';
import { NotFound } from './notFound/NotFound.jsx';
import * as Widgets from './Widgets';
import styles from './View.css';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refIndex: 0
        };
    }

    componentDidUpdate() {
        let refIndex = Number(localStorage.getItem('refIndex'));

        if (refIndex >= this.props.length) {
            refIndex = this.props.length - 1;
        }

        if (refIndex !== this.state.refIndex) {
            this.setState({ refIndex });
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
        const refIndex = Math.max(this.state.refIndex - 1, 0);
        localStorage.setItem('refIndex', refIndex);
        this.setState({ refIndex });
    };

    next = () => {
        const refIndex = Math.min(this.state.refIndex + 1, this.props.refs.length - 1);
        localStorage.setItem('refIndex', refIndex);
        this.setState({ refIndex });
    };

    render() {
        const refIndex = this.state.refIndex;
        const ref = this.props.refs[refIndex];
        const Widget = this.resolveRef(ref);

        return (
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
