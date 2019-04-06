import axios from "axios";
import AgentServices from "./agent.js";

const url = "api/local/files";

class FileServices {
    static getDirectoryTree() {
        return new Promise((resolve, reject) => {
            axios.get(url + "/").then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(AgentServices.getDirectoryTree());
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
    static getImageData(path) {
        return new Promise((resolve, reject) => {
            axios.get(url + "/display", {
                params: {
                    path: path
                }
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(AgentServices.getImageData(path));
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
    static getFileLines(path) {
        return new Promise((resolve, reject) => {
            axios.get(url + "/download", {
                params: {
                    path: path
                }
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(AgentServices.getFileLines(path));
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

export default FileServices;