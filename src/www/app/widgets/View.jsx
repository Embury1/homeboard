import React, { Component } from 'react';

import FontAwesome from 'font-awesome/css/font-awesome.css';

import { ErrorBoundary } from '../ErrorBoundary.jsx';
import * as Widgets from './Widgets';
import styles from './View.css';

class View extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    refIndex: 0
	};
    }

    componentWillReceiveProps(nextProps) {
	const refIndex = this.state.refIndex;
	if (refIndex > 0 && refIndex >= (nextProps.refs.length - 1)) {
	    this.setState({ refIndex: nextProps.refs.length - 1 });
	}
    }

    toView = (ref) => {
	const [widget, mode] = ref.split('/');
	return Widgets[widget][mode];
    };

    previous = (event) => {
	this.setState((prevState) => ({ refIndex: prevState.refIndex - 1 }));
    };

    next = (event) => {
	this.setState((prevState) => ({ refIndex: prevState.refIndex + 1 }));
    };

    render() {
	const refIndex = this.state.refIndex;

	const ref = this.props.refs.length
	    ? this.props.refs[this.state.refIndex]
	    : 'Placeholder/View';

	const Widget = this.toView(ref);

	return (
	    <React.Fragment>
		{this.props.refs.length > 1 && this.state.refIndex > 0 &&
		    <div className={styles.previous} onClick={this.previous}>
			<i className={[FontAwesome.fa, FontAwesome['fa-angle-left']].join(' ')}></i> 
		    </div>
		}

				<ErrorBoundary>
					<Widget {...this.props} />
				</ErrorBoundary>

		{this.props.refs.length > 1 && this.state.refIndex < (this.props.refs.length - 1) &&
		    <div className={styles.next} onClick={this.next}>
			<i className={[FontAwesome.fa, FontAwesome['fa-angle-right']].join(' ')}></i> 
		    </div>
		}
	    </React.Fragment>
	);
    }
}

export default View;
