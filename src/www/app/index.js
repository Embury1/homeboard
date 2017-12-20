import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import io from 'socket.io-client';
import styles from '../css/main.css';
import View from './widgets/view';

class App extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    devicesSocket: io('http://localhost:8081/devices', {path: '/ws'}),
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

    render() {
	return (
	    <div>
		<i>{this.state.settings.name}</i>
		<View refs={this.state.settings.refs} {...this.state} />
	    </div>
	);
    }
}

render(
    <App />,
    document.getElementById('root')
);
