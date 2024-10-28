import { RepositoryDetailsHandler } from './RepositoryDetailsHandler';

export class FetchRepositoryDetailsHandler extends RepositoryDetailsHandler {
    private readonly baseURL: string;

    constructor(baseURL: string) {
        super();
        this.baseURL = baseURL;
    }

    protected async process(request: RepositoryDetailsRequest): Promise<void> {
        const url = `${this.baseURL}/repos/${request.userName}/${request.repoName}`;
        const data = await this.fetchData(url, request.token);
        request.repoData = data;
    }
}