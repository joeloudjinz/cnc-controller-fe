import axios from "axios";
import AgentServices from "./agent.js";

const url = "http://localhost:3000/api/local/images";
// /convert

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
          resolve(result.data.data);
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
}

export default ConversionServices;
