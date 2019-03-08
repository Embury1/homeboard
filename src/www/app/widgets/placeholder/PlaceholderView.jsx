import React, { Fragment } from 'react';

import vars from '../../vars';
import styles from './PlaceholderView.css';

function PlaceholderView(props) {
    function setAdminEdit(event) {
        event.preventDefault();
        const refs = ['Admin/Edit'];
        const settings = Object.assign({}, props.settings, { refs });
        const device = Object.assign({}, { settings });
        console.log('settings: ', props.settings);
        const deviceId = props.deviceId;
        fetch(`${vars.apiBaseUrl}/api/devices/${deviceId}`, {
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
    }

    return (
        <Fragment>
            <h2>No widgets selected</h2>
            <button type="button" className={styles.btn} onClick={setAdminEdit}>Set AdminEdit</button>
        </Fragment>
    );
}

export { PlaceholderView };
