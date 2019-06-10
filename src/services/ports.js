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
    static isPortOpen(portName) {
        return new Promise(async (resolve, reject) => {
            await axios.get(url + '/isOpen', {
                    params: {
                        portName: portName
                    }
                })
                .then((result) => {
                    resolve(result.data.isOpen);
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(PortServices.isPortOpen(portName));
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
    static isPortActive(portName) {
        return new Promise(async (resolve, reject) => {
            await axios.get(url + '/isActive', {
                    params: {
                        portName: portName
                    }
                })
                .then((result) => {
                    resolve(result.data.status);
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(PortServices.isPortActive(portName));
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
    static isServerActive() {
        return new Promise(async (resolve, reject) => {
            await axios.get(url + '/draw/isActive')
                .then((result) => {
                    resolve(result.data.status);
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(PortServices.isServerActive());
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
                portName,
                target: localStorage.id
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
    static pauseSendOperation(portName) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/draw/pause", {
                portName,
                target: localStorage.id
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.pauseSendOperation(portName));
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
    static resumeSendOperation(portName) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/draw/resume", {
                portName,
                target: localStorage.id
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.resumeSendOperation(portName));
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
    static stopSendOperation(portName) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/draw/stop", {
                portName,
                target: localStorage.id
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.stopSendOperation(portName));
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
    static openPort(portName) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/open", {
                portName,
                target: localStorage.id
            }).then((result) => {
                resolve(result.data.success);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.openPort(portName));
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
    static closePort(portName) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/close", {
                portName
            }).then((result) => {
                resolve(result.data.success);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.closePort(portName));
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
    static writeToPort(portName, data) {
        return new Promise((resolve, reject) => {
            axios.post(url + "/write", {
                portName,
                data
            }).then((result) => {
                resolve(result.data.success);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(PortServices.writeToPort(portName));
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