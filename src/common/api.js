// let URL = 'http://localhost:3002/api/';
// console.log('window.location.host=', window.location.host);
// if (window.location.host === '47.105.170.226') {
//     URL = 'http://47.105.170.226/api/';
// }

// export default {
//     URL
// };
let URL = 'http://localhost:3003/api/';
console.log('window.location.host=', window.location.host);
if (window.location.host === '47.105.170.226:8080') {
    URL = 'http://47.105.170.226:3003/api/';
}

export default {
    URL
};
