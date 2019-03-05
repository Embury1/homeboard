import React, { Component } from 'react';

import moment from 'moment-timezone';
import * as _ from 'lodash';

import vars from '../../vars';
import * as Widgets from '../Widgets';
import styles from './AdminEdit.css';

const ADMIN_EDIT_REF = 'Admin/Edit';
const PLACEHOLDER_VIEW_REF = 'Placeholder/View';

class AdminEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            currentDevice: { settings: { name: '' } },
            selectedRefs: [],
            refs: Object.keys(Widgets).reduce((refs, widget) => {
                return refs.concat(Object.keys(Widgets[widget]).map((mode) => {
                    return `${widget}/${mode}`;
                }));
            }, [])
        };
    }

    componentDidMount() {
        fetch(`${vars.apiBaseUrl}/api/devices`)
            .then((res) => {
                return res.json();
            }).then((devices) => {
                this.setState({ devices, currentDevice: devices[0], selectedRefs: [].concat(devices[0].settings.refs) });
            }).catch((err) => {
                // TODO: Handle error
            });
    }

    setCurrentDevice = (event) => {
        const deviceId = event.target.value;
        const device = Object.assign({}, this.state.devices.find((dev) => dev._id == deviceId));
        this.setState({ currentDevice: device, selectedRefs: device.settings.refs });
    };

    selectRefs = (event) => {
        const options = Array.apply(null, event.target.options);
        const refs = this.state.selectedRefs;

        options.forEach((option) => {
            const ref = option.value;
            if (option.selected && !_.includes(refs, ref)) {
                refs.push(ref);
            } else if (!option.selected && _.includes(refs, ref)) {
                refs.splice(refs.indexOf(ref), 1);
            }
        });

        this.setState({ selectedRefs: refs });
    };

    updateDevice = (event) => {
        const prop = event.target.name;
        const value = event.target.value;
        const device = Object.assign({}, this.state.currentDevice);
        device.settings[prop] = value;
        this.setState({ currentDevice: device });
    };

    save = (event) => {
        event.preventDefault();
        const refs = this.state.selectedRefs;
        const device = Object.assign({}, this.state.currentDevice);
        device.settings.refs = refs;
        fetch(`${vars.apiBaseUrl}/api/devices/${device._id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(device)
        }).then((res) => {
            return res.json();
        }).then((updatedDevice) => {
            // TODO: Confirm update
        }).catch((err) => {
            // TODO: Handle error
        });
    };

    cancel = (event) => {
        const deviceId = this.state.currentDevice._id;
        const device = this.state.devices.find((dev) => dev._id == deviceId);
        this.setState({ currentDevice: device, selectedRefs: device.settings.refs });
    };

    render() {
        const deviceOptions = this.state.devices.map((device) => {
            return (
                <option value={device._id} key={device._id}>{device._id} {device.settings.name}</option>
            );
        });

        const refOptions = this.state.refs.filter((ref) => ref !== PLACEHOLDER_VIEW_REF && (this.props.deviceId !== this.state.currentDevice._id || ref !== ADMIN_EDIT_REF)).map((ref) => {
            return (
                <option value={ref} key={ref}>{ref}</option>
            );
        });

        return (
            <form name="deviceForm" className={styles.form}>
                <section className={styles.column}>
                    <select value={this.state.currentDevice._id} onChange={this.setCurrentDevice} className={styles.devices}>
                        {deviceOptions}
                    </select>

                    <table className={styles.info}>
                        <tbody>
                            <tr>
                                <th className={styles.created}>
                                    <strong>Created</strong>
                                </th>
                                <th className={styles.connected}>
                                    <strong>Connected</strong>
                                </th>
                            </tr>
                            <tr>
                                <td className={styles.created}>
                                    {moment(this.state.currentDevice.created).format('YYYY-MM-DD HH:mm:ss')}
                                </td>
                                <td className={styles.connected}>{moment(this.state.currentDevice.connected).format('YYYY-MM-DD HH:mm:ss')}</td>
                            </tr>
                        </tbody>
                    </table>

                    <button type="submit" className={styles.save} onClick={this.save}>Save</button>
                    <button type="button" className={styles.cancel} onClick={this.cancel}>Cancel</button>
                </section>

                <section className={styles.column}>
                    <input type="text" name="name" value={this.state.currentDevice.settings.name} onChange={this.updateDevice} className={styles.name} />

                    <select multiple value={this.state.selectedRefs} onChange={this.selectRefs} className={styles.refs}>
                        {refOptions}
                    </select>
                </section>
            </form>
        );
    }
}

export { AdminEdit };
