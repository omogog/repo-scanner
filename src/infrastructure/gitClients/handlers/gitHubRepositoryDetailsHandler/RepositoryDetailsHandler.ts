import axios, { AxiosRequestConfig } from 'axios';

export abstract class RepositoryDetailsHandler {
    protected nextHandler?: RepositoryDetailsHandler;

    setNext(handler: RepositoryDetailsHandler): RepositoryDetailsHandler {
        this.nextHandler = handler;
        return handler;
    }

    protected createConfig(token: string): AxiosRequestConfig {
        return {
            headers: { Authorization: `Bearer ${token}` },
        };
    }

    protected async fetchData(url: string, token: string): Promise<any> {
        const config = this.createConfig(token);
        const response = await axios.get(url, config);
        return response.data;
    }

    async handle(request: RepositoryDetailsRequest): Promise<RepositoryDetailsRequest> {
        await this.process(request);

        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return request;
    }

    protected abstract process(request: RepositoryDetailsRequest): Promise<void>;
}