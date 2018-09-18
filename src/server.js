import axios from 'axios';
import qs from 'qs';
let http = {
    post:'',
    get:''
};
let instance = axios.create({
    headers:{token:localStorage.getItem('king-token')}
});
http.post = function (api,data) {
    let params = qs.stringify(data);
    return new Promise((resolve,reject) => {
        instance.post(api,params).then((res) => {
            if(res.data.status===-1){
                localStorage.removeItem('king-token');
            }
            resolve(res.data);
        })
    })
};

http.get = function (api,data) {
    let params = qs.stringify(data);
    return new Promise((resolve,reject) => {
        instance.get(api,params).then((res) => {
            if(res.data.status===-1){
                localStorage.removeItem('king-token');
            }
            resolve(res.data);
        })
    })
};
export default http;