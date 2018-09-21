import axios from 'axios';
import qs from 'qs';
let http = {
    post:'',
    get:''
};
function set_token(){
    let user_info_json = localStorage.getItem('king-token') === null? [] : localStorage.getItem('king-token');
    let user_info={};
    let token=null;
    if(user_info_json.length){
        user_info = JSON.parse(user_info_json)
        token = user_info.token
    }
    let instance = axios.create({
        headers:{token:token}
    });
    return instance
}
http.post = function (api,data) {
    let params = qs.stringify(data),
        instance = set_token();
    return new Promise((resolve,reject) => {
        instance.post(api,params).then((res) => {
            if(res.data.status===-1){
                localStorage.removeItem('king-token');
                window.location.href=`/admin`;
            }
            resolve(res.data);
        })
    })
};

http.get = function (api,data) {
    let params = qs.stringify(data),
    instance = set_token();
    return new Promise((resolve,reject) => {
        instance.get(api,params).then((res) => {
            if(res.data.status===-1){
                localStorage.removeItem('king-token');
                window.location.href=`/admin`;
            }
            resolve(res.data);
        })
    })
};
export default http;