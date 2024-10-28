class RepositoryDetailsRequest {
    token: string;
    repoName: string;
    userName?: string;
    repoData?: any;
    files?: any[];
    ymlFileContent?: string;
    activeWebhooks?: string[];

    constructor(token: string, repoName: string) {
        this.token = token;
        this.repoName = repoName;
        this.activeWebhooks = [];
    }
}