import axios from 'axios';

const url = 'http://localhost:3000/api/local/auth/';

class AuthServices {
    /**
     * perform login process by consuming /login endpoint
     * @param {*} credentials contains user email address and password
     */
    static Login(credentials) {
        return new Promise((resolve, reject) => {
            axios
                .post(url + "login", credentials)
                .then(result => {
                    // console.log(result);
                    resolve(result.data);
                })
                .catch(err => {
                    if (err.response) {
                        reject(err.response.data.failure);
                    } else if (err.request) {
                        reject(err.request);
                    } else {
                        reject(err.message);
                    }
                });
        });
    }
    /**
     * perform logout by consuming /logout endpoint
     * @param {*} id user id to deactivated it's status
     */
    static Logout(id) {
        return new Promise((resolve, reject) => {
            // console.log(window.localStorage.getItem('token'));
            axios.post(url + 'logout', {
                id
            }, {
                headers: {
                    Authorization: "Bearer " + window.localStorage.token
                }
            }).then(() => {
                resolve(true);
            }).catch((error) => {
                if (error.response) {
                    reject(error.response.data.failure);
                } else if (error.request) {
                    reject(error.request);
                } else {
                    reject(error.message);
                }
            });
        });
    }
}

export default AuthServices;