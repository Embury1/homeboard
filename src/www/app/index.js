import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import io from 'socket.io-client';
import styles from '../css/main.css';

class App extends Component {
    constructor(props) {
        super(props);
	this.state = {
	    devicesSocket: io('http://localhost:8081/devices', {path: '/ws'})
	};
	
	this.state.devicesSocket.on('identify', (cb) => {
	    cb(localStorage.getItem('deviceId'));
	});
	
	this.state.devicesSocket.on('register', (newId) => {
	    localStorage.setItem('deviceId', newId);
	    console.log('Registered new id.', newId);
	});
    }

    render() {
        return (
            <h1 className={styles.title}>Homeboard</h1>
        );
    }
}

render(
    <App />,
    document.getElementById('root')
);
