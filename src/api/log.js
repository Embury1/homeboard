import moment from 'moment-timezone';
import { inspect } from 'util';

export default {
    info,
    error
};

function info(msg, obj) {
    console.log(`[${moment().format('HH:mm:ss YYYY-MM-DD')}] ${msg}`);
    if (obj) console.log(inspect(obj, false, null));
}   

function error(msg, obj) {
    console.error(`[${moment().format('HH:mm:ss YYYY-MM-DD')}] ${msg}`);
    if (obj) console.log(inspect(obj, false, null));
}   
