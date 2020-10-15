import axios from "axios";
import store from "@/store";
axios.defaults.timeout = 5000;
// axios.defaults.baseURL = 'http://localhost:18889/';
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["Content-Type"] = "application/json";

axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    if (config.data == undefined) {
      config.data = {};
    } else {
      config.data = JSON.stringify(config.data);
    }

    config.headers = {
      Authorization: "Bearer " + store.state.token,
      "Content-Type": "application/json"
    };

    // if(token){
    //   config.params = {'token':token}
    // }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  response => {
    // if (response.data.errCode == 2) {
    //   router.push({
    //     path: "/login",
    //     query: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
    //   })
    // }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}
