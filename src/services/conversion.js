import axios from "axios";
import AgentServices from "./agent.js";

const url = "api/local/conversions";

const target = window.localStorage.getItem("id");

class ConversionServices {
  static ConvertImage(formData) {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(url + "/convert", formData, {
          headers: {
            Authorization: "Bearer " + window.localStorage.token
          }
        })
        .then(result => {
          resolve(result.data);
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status == 406) {
              AgentServices.RefreshToken()
                .then(() => {
                  resolve(ConversionServices.ConvertImage(formData));
                })
                .catch(error => {
                  reject(error);
                });
            } else {
              //? The request was made and the server responded with a status code
              //? that falls out of the range of 2xx
              reject(error.response.data.failure);
            }
          } else if (error.request) {
            reject("Check you internet connection!");
          } else {
            //? Something happened in setting up the request that triggered an Error
            reject(error.message);
          }
        });
    });
  }
  static QuickConvertImage(imageName, params) {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(url + "/convert/quick", {
          parameters: params, target
        }, {
          params: {
            imageName,
          },
          headers: {
            Authorization: "Bearer " + window.localStorage.token
          }
        })
        .then(result => {
          resolve(result.data);
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status == 406) {
              AgentServices.RefreshToken()
                .then(() => {
                  resolve(ConversionServices.QuickConvertImage(imageName, params));
                })
                .catch(error => {
                  reject(error);
                });
            } else {
              //? The request was made and the server responded with a status code
              //? that falls out of the range of 2xx
              reject(error.response.data.failure);
            }
          } else if (error.request) {
            reject("Check you internet connection!");
          } else {
            //? Something happened in setting up the request that triggered an Error
            reject(error.message);
          }
        });
    });
  }
  static getConversionsCount() {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(url + "/count", {
          headers: {
            Authorization: "Bearer " + window.localStorage.token
          }
        })
        .then(result => {
          resolve(result.data.count);
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status == 406) {
              AgentServices.RefreshToken()
                .then(() => {
                  resolve(ConversionServices.getConversionsCount());
                })
                .catch(error => {
                  reject(error);
                });
            } else {
              //? The request was made and the server responded with a status code
              //? that falls out of the range of 2xx
              reject(error.response.data.failure);
            }
          } else if (error.request) {
            reject("Check you internet connection!");
          } else {
            //? Something happened in setting up the request that triggered an Error
            reject(error.message);
          }
        });
    });
  }
}

export default ConversionServices;