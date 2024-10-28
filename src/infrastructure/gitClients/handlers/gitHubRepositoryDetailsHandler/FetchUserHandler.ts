import { RepositoryDetailsHandler } from './RepositoryDetailsHandler';

export class FetchUserHandler extends RepositoryDetailsHandler {
    private readonly baseURL: string;

    constructor(baseURL: string) {
        super();
        this.baseURL = baseURL;
    }

    protected async process(request: RepositoryDetailsRequest): Promise<void> {
        const url = `${this.baseURL}/user`;
        const data = await this.fetchData(url, request.token);
        request.userName = data.login;
    }
}