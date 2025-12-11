import util from 'util';

export function ConsoleLog(status, message, error = '') {
    switch (status) {
        case 'success':
            console.log(util.styleText('bgGreen', `Success:`), message);
            break;

        case 'error':
            console.error(util.styleText('bgRed', `Error: ${message}:`), error);
            break;

        default:
            console.log(message);
            break;
    }
}


export function getDataFromDB(callback) {
}