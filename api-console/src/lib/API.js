import axios from "axios";
import useSWR from "swr";

const API = axios.create({
  baseURL: "https://partner-api.near.st/v1/"
});

API.interceptors.request.use(async(request) => {
  console.log(`[API] Started ${request?.method} ${request?.url}`);
  if (request.headers && !request.headers["Authorization"]) {
      request.headers["Authorization"] = `Bearer ${import.meta.env.VITE_NEARST_API_KEY}`;
  }

  return request;
});

API.interceptors.response.use((response) => {
  console.log(`[API] Got ${response?.status} for ${response?.request._url}`);
  return response;
});

export const useAPI = (method, params = {}, config = {}) => {
  const { data, mutate, isValidating } = useSWR(`${method} ${JSON.stringify(params)}`, async() => {
    const { data } = await API.get(method, { params });
    return data;
  }, config);

  return [data, mutate, isValidating];
};

export default API;
