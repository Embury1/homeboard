import React, { Component } from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		this.setState({ hasError: true });
	}

	render() {
		if (this.state.hasError) {
			return <h2>Error rendering component</h2>;
		}
		return this.props.children;
	}
}

export { ErrorBoundary };