import { HttpClient } from "../../application/http";
import { AxiosHttpClient } from "./AxiosHttpClient";

export class HttpClientFactory {
    static create(): HttpClient {
        return new AxiosHttpClient();
    }
}