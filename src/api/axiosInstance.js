import axios from 'axios';

export const baseURL = 'http://192.168.1.25:9000/';
export const imagePath = baseURL + 'images/';

const axiosInstanceCreator = () => {
    const token = localStorage.getItem('token');

    return token
        ? axios.create({
              baseURL: baseURL,
              headers: {
                  Authorization: token
              }
          })
        : axios.create({
              baseURL: baseURL,
              headers: {}
          });
};

export let axiosInstance;

export const renewAxiosInstance = () => {
    axiosInstance = axiosInstanceCreator();
};

renewAxiosInstance();
