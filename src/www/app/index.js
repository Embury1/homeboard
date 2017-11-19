import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import io from 'socket.io-client';
import styles from '../css/main.css';
import View from './widgets/view';

// Received from api
const refs = [
    'admin/edit'
];

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
	    cb(localStorage.getItem('deviceId'));
	});
	
	this.state.devicesSocket.on('register', (newId) => {
	    localStorage.setItem('deviceId', newId);
	    console.log('Registered new id.', newId);
	});

	this.state.devicesSocket.on('initialize', (settings) => {
	    this.setState({ settings: settings });
	});
    }

    render() {
        return (
            <div>
		<View refs={this.state.settings.refs} />
	    </div>
        );
    }
}

render(
    <App />,
    document.getElementById('root')
);
