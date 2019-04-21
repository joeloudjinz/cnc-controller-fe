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
                                resolve(FileServices.getDirectoryTree());
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
                                resolve(FileServices.getImageData(path));
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
                                resolve(FileServices.getFileLines(path));
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
    static deleteGcodeFile(fileName) {
        return new Promise((resolve, reject) => {
            axios.delete(url + "/gcodes", {
                params: {
                    fileName
                }
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(FileServices.deleteGcodeFile(fileName));
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
    static deleteOutputDirectory(dirName) {
        return new Promise((resolve, reject) => {
            axios.delete(url + "/outputs", {
                params: {
                    dirName
                }
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(FileServices.deleteOutputDirectory(dirName));
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
    static deleteImage(imageName) {
        return new Promise((resolve, reject) => {
            axios.delete(url + "/images", {
                params: {
                    imageName
                }
            }).then((result) => {
                resolve(result.data);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(FileServices.deleteImage(imageName));
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