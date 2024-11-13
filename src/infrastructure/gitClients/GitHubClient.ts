import { GitClient } from "../../application/gitClients";
import { RepositorySummary, RepositoryDetails } from "../../domain/entitities";
import { RepoData, ContentFile, Webhook, UserData } from "./types";
import { HttpClient } from "../../application/http";
import { HttpClientFactory } from "../http/HttpClientFactory";

export class GitHubClient implements GitClient {
  private httpClient: HttpClient;

  constructor(private readonly baseURL: string) {
    this.httpClient = HttpClientFactory.create();
  }

  async listRepositories(token: string, page: number): Promise<RepositorySummary[]> {
    const config = this.createAuthConfig(token, { per_page: 10, page });
    const response = await this.fetchUserRepositories(config);
    return response.map(this.transformToRepositorySummary);
  }

  async getRepositoryDetails(token: string, repoName: string): Promise<RepositoryDetails> {
    const config = this.createAuthConfig(token);

    const userLogin = await this.fetchUserLogin(config);
    const repoData = await this.fetchRepositoryData(config, userLogin, repoName);
    const files = await this.fetchRepositoryContents(config, userLogin, repoName);
    const activeWebhooks = await this.fetchRepositoryWebhooks(config, userLogin, repoName);

    const fileCount = files.length;
    const ymlFileContent = await this.fetchYmlFileContent(files);

    return new RepositoryDetails(
        repoData.name,
        repoData.size,
        repoData.owner.login,
        repoData.private,
        fileCount,
        ymlFileContent,
        activeWebhooks
    );
  }

  private createAuthConfig(token: string, params: any = {}): any {
    return {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,// settings of current client, so in that case not require to put it into constant or env file
      params,
    };
  }

  private async fetchUserRepositories(config: any): Promise<RepoData[]> {
    return this.httpClient.get<RepoData[]>(`${this.baseURL}/user/repos`, config);
  }

  private async fetchUserLogin(config: any): Promise<string> {
    const response = await this.httpClient.get<UserData>(`${this.baseURL}/user`, config);
    return response.login;
  }

  private async fetchRepositoryData(config: any, userLogin: string, repoName: string): Promise<RepoData> {
    return this.httpClient.get<RepoData>(`${this.baseURL}/repos/${userLogin}/${repoName}`, config);
  }

  private async fetchRepositoryContents(config: any, userLogin: string, repoName: string): Promise<ContentFile[]> {
    return this.httpClient.get<ContentFile[]>(`${this.baseURL}/repos/${userLogin}/${repoName}/contents`, config);
  }

  private async fetchRepositoryWebhooks(config: any, userLogin: string, repoName: string): Promise<string[]> {
    try {
      const response = await this.httpClient.get<Webhook[]>(`${this.baseURL}/repos/${userLogin}/${repoName}/hooks`, config);
      return response.map((hook) => hook.config.url);
    } catch (error) {
      // api key require access additional permission to receive webhooks
      console.error("Error fetching webhooks or no access", error);
      return [];
    }
  }

  private async fetchYmlFileContent(files: ContentFile[]): Promise<string | undefined> {
    const ymlFile = files.find((file) => file.name.endsWith(".yml"));
    if (!ymlFile) return undefined;

    return this.httpClient.get<string>(ymlFile.download_url);
  }

  private transformToRepositorySummary(repo: RepoData): RepositorySummary {
    return new RepositorySummary(repo.name, repo.size, repo.owner.login);
  }
}