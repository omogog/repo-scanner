import { RepositoryDetailsHandler } from './RepositoryDetailsHandler';

export class FetchWebhooksHandler extends RepositoryDetailsHandler {
    private readonly baseURL: string;

    constructor(baseURL: string) {
        super();
        this.baseURL = baseURL;
    }

    protected async process(request: RepositoryDetailsRequest): Promise<void> {
        const url = `${this.baseURL}/repos/${request.userName}/${request.repoName}/hooks`;
        try {
            const data = await this.fetchData(url, request.token);
            request.activeWebhooks = data.map((hook: any) => hook.config.url);
        } catch (e) {
            console.error('Error fetching webhooks or no access', e);
        }
    }
}