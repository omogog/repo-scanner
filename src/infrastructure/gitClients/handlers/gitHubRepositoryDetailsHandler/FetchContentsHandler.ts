import {RepositoryDetailsHandler} from './RepositoryDetailsHandler';

export class FetchContentsHandler extends RepositoryDetailsHandler {
    private readonly baseURL: string;

    constructor(baseURL: string) {
        super();
        this.baseURL = baseURL;
    }

    protected async process(request: RepositoryDetailsRequest): Promise<void> {
        const url = `${this.baseURL}/repos/${request.userName}/${request.repoName}/contents`;
        request.files = await this.fetchData(url, request.token);
    }
}