import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import styles from '../css/main.css';

class App extends Component {
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

fetch('/api/hello')
    .then((res) => {
        return res.text();
    }).then((text) => {
        console.log('Response from api:', text);
    });