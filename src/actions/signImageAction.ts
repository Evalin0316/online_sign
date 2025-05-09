import axios from "axios";
const url = 'https://auto-signature-app-v7-4.fly.dev';

// upload image
export const uploadImage = (data: FormData) => {
  return axios.post(`${url}/image/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
  
// load all sign image
export const loadImages = () => {
  return axios.get(`${url}/image/`);
}

// delete image
export const deleteImage = (id: string, imageName: string) => {
  return axios.delete(`${url}/image/${id}/imagename/${imageName}`);
}
