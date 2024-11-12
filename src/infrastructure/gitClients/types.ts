export interface RepoOwner {
    login: string;
}

export interface RepoData {
    name: string;
    size: number;
    owner: RepoOwner;
    private: boolean;
}

export interface ContentFile {
    name: string;
    download_url: string;
}

export interface WebhookConfig {
    url: string;
}

export interface Webhook {
    config: WebhookConfig;
}

export interface UserData {
    login: string;
}