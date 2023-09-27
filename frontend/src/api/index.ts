import { HttpMethod, initFetch } from "../utils/fetch";

const fetchCall = initFetch("http://localhost:3000");

export const getHelloWorld = () => {
  return fetchCall<{ data: string }>(HttpMethod.GET, `/`);
};
