import axios from "axios";
import { backendUrl } from "./auth";
import React from "react";

export type DefaultResponse =
  | {
      succes: true;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const axiosInstance = axios.create({
  validateStatus: function (status) {
    // Always return true to resolve the promise for any status code
    return true;
  },
});

export const fetchResponse = async <T = any>({
  setResponse,
  url,
  query = "",
  setLoading,
}: {
  setResponse: React.Dispatch<React.SetStateAction<T | null>>;
  url: string;
  query?: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Retrieve the token from the local storage.
  (setLoading ? setLoading : () => {})(true);
  const token = localStorage.getItem("token");
  axiosInstance
    .get(backendUrl + url + "?" + query, {
      headers: {
        // Set the Authorization header to include the token.
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      // If the request is successful, update the response state with the data received from the server.
      console.log(response);

      setResponse((s) =>
        response.data.succes === undefined
          ? s !== undefined
            ? s
            : null
          : response.data
      );
      (setLoading ? setLoading : () => {})(false);
    })
    .catch((error) => {
      // If there is an error, log the error to the console
      setResponse((s) => (s !== undefined ? s : null));
      console.error(error);
      (setLoading ? setLoading : () => {})(false);
    });
};

export const fetchPost = async <T = any>({
  setResponse,
  url,
  data,
  setLoading,
}: {
  setResponse: React.Dispatch<React.SetStateAction<T | null>>;
  url: string;
  data: { [key: string]: any };
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Retrieve the token from the local storage.
  (setLoading ? setLoading : () => {})(true);
  const token = localStorage.getItem("token");
  axiosInstance
    .post(backendUrl + url, {
      ...data,
      headers: {
        // Set the Authorization header to include the token.
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      // If the request is successful, update the response state with the data received from the server.
      console.log(response);

      setResponse((s) =>
        response.data.succes === undefined
          ? s !== undefined
            ? s
            : null
          : response.data
      );
      (setLoading ? setLoading : () => {})(false);
    })
    .catch((error) => {
      // If there is an error, log the error to the console
      setResponse((s) => (s !== undefined ? s : null));
      console.error(error);
      (setLoading ? setLoading : () => {})(false);
    });
};
