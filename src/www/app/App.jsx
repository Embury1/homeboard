import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

import io from 'socket.io-client';
import FontAwesome from 'font-awesome/css/font-awesome.css';

import vars from './vars';
import styles from './App.css';
import View from './widgets/View.jsx';

const DEVICEID_KEY = 'deviceId';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            devicesSocket: io(`${vars.apiBaseUrl}/devices`, { path: '/ws' }),
            recipesSocket: io(`${vars.apiBaseUrl}/recipes`, { path: '/ws' }),
            vendorProductsSocket: io(`${vars.apiBaseUrl}/vendorProducts`, { path: '/ws' }),
            shoppingListsSocket: io(`${vars.apiBaseUrl}/shoppingLists`, { path: '/ws' }),
            settings: {
                refs: []
            },
            online: true
        };
    }

    componentDidMount() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                }).catch(error => {
                    console.log('SW registration failed: ', error);
                }).finally(() => {
                    this.init();
                });
            });
        } else {
            this.init();
        }

        window.oncontextmenu = (event) => {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };

        window.addEventListener('online', () => this.setState({ online: true }));
        window.addEventListener('offline', () => this.setState({ online: false }));
    }

    componentWillUnmount() {
        this.state.devicesSocket.off();
    }

    init() {
        const deviceId = localStorage.getItem(DEVICEID_KEY);
        const fetchMethod = deviceId ? this.getDevice : this.createDevice;
        fetchMethod(deviceId).then((res) => {
            if (fetchMethod === this.getDevice && res.status === 404) {
                localStorage.removeItem(DEVICEID_KEY);
                return this.createDevice();
            }
            return Promise.resolve(res);
        }).then((res) => {
            return res.json();
        }).then((device) => {
            const deviceId = device._id;
            const settings = device.settings;
            this.setState({ deviceId, settings });
            localStorage.setItem(DEVICEID_KEY, deviceId);
            this.state.devicesSocket.emit('register:device', deviceId);
        }).catch((err) => {
            // TODO: Handle error
        });

        this.state.devicesSocket.on('update:deviceSettings', (settings) => {
            this.setState({ settings: settings });
            console.log('Received settings.', settings);
        });
    }

    getDevice(deviceId) {
        return fetch(`${vars.apiBaseUrl}/api/devices/${deviceId}`);
    }

    createDevice() {
        return fetch(`${vars.apiBaseUrl}/api/devices`, { method: 'POST' });
    }

    render() {
        return (
            <React.Fragment>
                <aside className={styles.statusBar}>
                    <span>{this.state.settings.name}</span>
                    <span>{this.state.deviceId}</span>
                    <span className={styles.online}>
                        {this.state.online
                            ? <i className={`${FontAwesome.fa} ${FontAwesome['fa-wifi']}`}></i>
                            : <i className={`${FontAwesome.fa} ${FontAwesome['fa-ban']}`}></i>}
                    </span>
                </aside>
                <View refs={this.state.settings.refs} {...this.state} />
            </React.Fragment>
        );
    }
}

render(
    <App />,
    document.getElementById('root')
);