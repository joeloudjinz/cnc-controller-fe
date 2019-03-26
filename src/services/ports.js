import axios from "axios";
import AgentServices from "./agent.js";

const url = "api/local/ports";

class PortServices {
    /**
     * TODO: add token to header
     * result contains success message, ports count and ports list
     */
    static getConnectedPortsList() {
        return new Promise(async (resolve, reject) => {
            await axios.get(url + '/').then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.getConnectedPortsList());
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
    static performFullDrawOperation(fileName, portName) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/draw", {
                fileName,
                portName
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.performFullDrawOperation());
                            })
                            .catch(error => {
                                reject(error);
                            });
                    } else {
                        //? The request was made and the server responded with a status code
                        //? that falls out of the range of 2xx
                        reject(error.response.data);
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
    static flushPort(portName) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/flush", {
                portName
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.flushPort(portName));
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
    static resumeEmittingPort(portName) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/resume", {
                portName
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.resumeEmittingPort(portName));
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
    static pauseEmittingPort(portName) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/pause", {
                portName
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.pauseEmittingPort(portName));
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
export default PortServices;