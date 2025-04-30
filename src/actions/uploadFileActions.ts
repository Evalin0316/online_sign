import axios from "axios";

const url = 'https://auto-signature-app-v7-4.fly.dev';

export const getFileDetail = (id: string) => {
  return axios.get(`${url}/file/${id}`);
}

export const getSingleFile = (fileLocation: string) => {
  return axios.get(`${fileLocation}`,{responseType:'blob'});
}

export const uploadFile = (data: string) => {
  return axios.post(`${url}/file`,data);
}

export const uploadSignInfo = (id: string, data: string) => {
  return axios.patch(`${url}/file/${id}/signInfo`,data);
}

export const uploadFileInfo = (id: string, data: string) => {
  return axios.patch(`${url}/file/${id}/fileInfo`,data);
}

export const updateFile = (id:string ,title:string, isSigned:boolean) =>{
  return axios.patch(`${url}/file/${id}?${title}&isSigned=${isSigned}`);
}