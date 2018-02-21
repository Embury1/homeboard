import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

import io from 'socket.io-client';

import styles from './App.css';
import View from './widgets/View.jsx';

class App extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    devicesSocket: io('http://localhost:8081/devices', { path: '/ws' }),
	    recipesSocket: io('http://localhost:8081/recipes', { path: '/ws' }),
	    vendorProductsSocket: io('http://localhost:8081/vendorProducts', { path: '/ws' }),
	    settings: {
		refs: []
	    }
	};

	this.state.devicesSocket.on('identify', (cb) => {
	    const deviceId = localStorage.getItem('deviceId');
	    cb(deviceId);
	    this.setState({ deviceId });
	    console.log('Responded to identification request.');
	});

	this.state.devicesSocket.on('register', (newId) => {
	    localStorage.setItem('deviceId', newId);
	    console.log('Registered new id.', newId);
	    this.setState({ deviceId: newId });
	});

	this.state.devicesSocket.on('initialize', (settings) => {
	    this.setState({ settings: settings });
	    console.log('Received settings.', settings);
	});
    }

    componentWillUnmount() {
	this.state.devicesSocket.off();
    }

    render() {
	return (
	    <React.Fragment>
		<p className={styles.deviceName}>{this.state.settings.name}</p>
		<p className={styles.deviceId}>{this.state.deviceId}</p>
		<View refs={this.state.settings.refs} {...this.state} />
	    </React.Fragment>
	);
    }
}

render(
    <App />,
    document.getElementById('root')
);
