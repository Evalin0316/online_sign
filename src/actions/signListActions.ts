import axios from "axios";

const url = 'https://auto-signature-app-v7-4.fly.dev';

export const loadSingleFile = (durl) => {
  return axios.get(`${durl}`,{responseType:'blob'})
}

export const loadFileList = async (from: number, count: number) => {
  const res = await axios.get(`${url}/file?from=${from}&count=${count}`);
  return res;
}

export const deleteFile = (id: string, filename: string) => {
  return axios.delete(`${url}/file/${id}/filename/${filename}`);
}