import axios from 'axios';
import qs from 'qs';
let http = {
    post:'',
    get:''
};
let instance = axios.create({
    token:''
});
http.post = function (api,data) {
    let params = qs.stringify(data);
    return new Promise((resolve,reject) => {
        instance.post(api,params).then((res) => {
            resolve(res);
        })
    })
};

http.get = function (api,data) {
    let params = qs.stringify(data);
    return new Promise((resolve,reject) => {
        instance.get(api,params).then((res) => {
            resolve(res);
        })
    })
};
export default http;