import axios from 'axios';
import store from '../store.js';
import router from '../router.js';

const url = "api/local/users/";
const authURL = 'api/local/auth/';

//! console.log(error.response.status == 406); true
//! console.log(error.response.status === 406); true
//! console.log(error.response.status === '406'); false

class AgentServices {
    /**
     * perform token refresh process by consuming /token endpoint
     * will regenerate access and refresh tokens and store them into local storage
     */
    static RefreshToken() {
        return new Promise((resolve, reject) => {
            const email = localStorage.email;
            const id = localStorage.id;
            const refresh_token = localStorage.refresh_token;
            axios.post(authURL + 'token/refresh', {
                email,
                id,
                refresh_token
            }).then((result) => {
                //? result.data holds refresh_token and token
                localStorage.refresh_token = result.data.refresh_token;
                localStorage.token = result.data.token;
                resolve(true);
            }).catch((error) => {
                if (error.response) {
                    //! 401 Unauthorized, invalid refresh token => this is treated by axios interceptor in main.js
                    //! 406 Not Acceptable, refresh token has expired
                    //! 409 Conflict, old refresh token
                    if (error.response.status == 409 || error.response.status == 406) {
                        store.commit('SHOW_LOGIN_ALERT_VALUE', 'Session has expired, login again please')
                        router.replace('/login');
                    }
                    reject(error.response.data.failure);
                } else if (error.request) {
                    reject(error.request);
                } else {
                    reject(error.message);
                }
            });
        });
    }
    /**
     * get all the non-deleted agents data in the system by consuming agents/ endpoint
     * protected by auth middleware
     */
    static getAgents() {
        // const id = store.state.id;
        const id = localStorage.id;
        return new Promise(async (resolve, reject) => {
            await axios
                .get(url + id,
                    // {
                    // headers: {
                    //     Authorization: "Bearer " + localStorage.token
                    // }
                    // }
                )
                .then(result => {
                    let data = result.data.data;
                    resolve(
                        data.map((currentItem, index) => ({
                            index: index,
                            id: currentItem.id,
                            first_name: currentItem.first_name,
                            last_name: currentItem.last_name,
                            email: currentItem.email,
                            is_active: currentItem.is_active ? true : false,
                            is_admin: currentItem.is_admin ? true : false
                        })));
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(AgentServices.getAgents());
                                }).catch((error) => {
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
    /**
     * delete agent (soft delete) from the system
     * protected by auth middleware
     * @param {*} id of the agent
     */
    static deleteAgentById(id) {
        return new Promise(async (resolve, reject) => {
            await axios
                .delete(url + id,
                    // {
                    // headers: {
                    //     Authorization: "Bearer " + localStorage.token
                    // }
                    // }
                )
                .then(result => {
                    resolve(result.data.success);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(AgentServices.deleteAgentById(id));
                                }).catch((error) => {
                                    reject(error);
                                });
                        } else {
                            reject(error.response.data.failure);
                        }
                    } else if (error.request) {
                        reject("Check you internet connection!");
                    } else {
                        reject(error.message);
                    }
                });
        });
    }
    /**
     * create a new agent
     * @param {*} agent data to be inserted into database
     * protected by auth middleware
     */
    static createAgent(agent) {
        return new Promise((resolve, reject) => {
            axios
                .post(url + "create", {
                        ...agent
                    }
                    // , {
                    // headers: {
                    //     Authorization: "Bearer " + localStorage.token
                    // }
                    // }
                )
                .then(response => {
                    resolve(response.data.success);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(AgentServices.createAgent(agent));
                                }).catch((error) => {
                                    reject(error);
                                });
                        } else {
                            reject(error.response.data.failure);
                        }
                    } else if (error.request) {
                        reject("Check you internet connection!");
                    } else {
                        reject(error.message);
                    }
                });
        });
    }
    /**
     * update agent information
     * @param {*} agent data
     * protected by auth middleware
     */
    static UpdateInformation(agent) {
        // console.log('in it ')
        return new Promise((resolve, reject) => {
            axios.put(url + agent.id, agent
                // , {
                // headers: {
                //     Authorization: "Bearer " + localStorage.token
                // }
                // }
            ).then((response) => {
                resolve(response.data.success);
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 406) {
                        AgentServices.RefreshToken()
                            .then(() => {
                                resolve(AgentServices.UpdateInformation(agent));
                            }).catch((error) => {
                                reject(error);
                            });
                    } else {
                        reject(error.response.data.failure);
                    }
                } else if (error.request) {
                    reject("Check you internet connection!");
                } else {
                    reject(error.message);
                }
            });
        });
    }
    /**
     * Update agent password
     * @param {*} password 
     */
    static UpdatePassword(password) {
        return new Promise((resolve, reject) => {
            const id = localStorage.id;
            if (id) {
                axios.put(url + "password/" + id, {
                            password
                        }
                        // , {
                        //     headers: {
                        //         Authorization: "Bearer " + localStorage.token
                        //     }
                        // }
                    )
                    .then((result) => {
                        resolve(result.data.success);
                    }).catch((error) => {
                        if (error.response) {
                            if (error.response.status == 406) {
                                AgentServices.RefreshToken()
                                    .then(() => {
                                        resolve(AgentServices.UpdatePassword(password));
                                    }).catch((error) => {
                                        reject(error);
                                    });
                            } else {
                                reject(error.response.data.failure);
                            }
                        } else if (error.request) {
                            reject("Check you internet connection!");
                        } else {
                            reject(error.message);
                        }
                    });
            } else {
                reject('ID is not defined!');
            }

        });
    }
    /**
     * Reset the password of an agent account
     * @param {*} id 
     */
    static resetAgentPassword(id) {
        return new Promise((resolve, reject) => {
            axios.get(url + "reset/" + id
                    // , {
                    //     headers: {
                    //         Authorization: "Bearer " + localStorage.token
                    //     }
                    // }
                )
                .then((result) => {
                    resolve(result);
                }).catch((error) => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(AgentServices.resetAgentPassword(id));
                                }).catch((error) => {
                                    reject(error);
                                });
                        } else {
                            reject(error.response.data.failure);
                        }
                    } else if (error.request) {
                        reject("Check you internet connection!");
                    } else {
                        reject(error.message);
                    }
                });
        });
    }
    /**
     * get the role (agent or admin) of the user
     * @params id of the user
     */
    static getRole(id) {
        return new Promise((resolve, reject) => {
            axios.get(url + "role/" + id)
                .then((result) => {
                    resolve(result);
                }).catch((error) => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(AgentServices.getRole(id));
                                }).catch((error) => {
                                    reject(error);
                                });
                        } else {
                            reject(error.response.data.failure);
                        }
                    } else if (error.request) {
                        reject("Check you internet connection!");
                    } else {
                        reject(error.message);
                    }
                });
        });
    }
    static getAgentsCount() {
        return new Promise(async (resolve, reject) => {
            await axios
                .get(url + "agents/count")
                .then(result => {
                    resolve(result.data.count);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(AgentServices.getAgentsCount());
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
    static getAdminsCount() {
        return new Promise(async (resolve, reject) => {
            await axios
                .get(url + "admins/count"
                    // , {
                    // headers: {
                    //     Authorization: "Bearer " + localStorage.token
                    // }
                    // }
                )
                .then(result => {
                    resolve(result.data.count);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status == 406) {
                            AgentServices.RefreshToken()
                                .then(() => {
                                    resolve(AgentServices.getAdminsCount());
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

export default AgentServices;