import axios, { AxiosRequestConfig } from "axios";
import { HttpClient } from "../../application/http";

export class AxiosHttpClient implements HttpClient {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await axios.get<T>(url, config);
        return response.data;
    }
}