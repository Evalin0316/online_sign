import axios from "axios";
const url = 'https://auto-signature-app-v7-4.fly.dev';

// upload image
export const uploadImage = (data: string) => {
    return axios.post(`${url}/image/`,data);
}

// load all sign image
export const loadImages = () => {
    return axios.get(`${url}/image/`);
}

// delete image
export const deleteImage = (id: string, hash: string, imageUrl: string) => {
    return axios.delete(`${url}/image/${id}/hash/${hash}/image-str/${imageUrl}`);
}
