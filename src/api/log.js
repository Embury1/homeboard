import moment from 'moment-timezone';

export default {
    info,
    error
};

function info(msg) {
    console.log(`[${moment().format('HH:mm:ss YYYY-MM-DD')}] ${msg}`);
}   

function error(msg) {
    console.error(`[${moment().format('HH:mm:ss YYYY-MM-DD')}] ${msg}`);
}   
