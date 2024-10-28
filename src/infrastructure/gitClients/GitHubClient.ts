import axios, { AxiosRequestConfig } from 'axios';
import { GitClient } from '../../domain/abstractions';
import { CodeRepository } from '../../domain/entities';
import {
  FetchRepositoryDetailsHandler,
  FetchUserHandler,
  FetchWebhooksHandler
} from "./handlers/gitHubRepositoryDetailsHandler";
import {FetchContentsHandler} from "./handlers/gitHubRepositoryDetailsHandler/FetchContentsHandler";
import {FetchYAMLFileHandler} from "./handlers/gitHubRepositoryDetailsHandler/FetchYAMLFileHandler";

export class GitHubClient implements GitClient {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async listRepositories(token: string): Promise<CodeRepository[]> {
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(`${this.baseURL}/user/repos`, config);
    return response.data.map(
      (repo: any) => new CodeRepository(repo.name, repo.size, repo.owner.login)
    );
  }

  async getRepositoryDetails(
    token: string,
    repoName: string
  ): Promise<CodeRepository> {
    const request = new RepositoryDetailsRequest(token, repoName);

    const fetchUserHandler = new FetchUserHandler(this.baseURL);
    const fetchRepoDetailsHandler = new FetchRepositoryDetailsHandler(this.baseURL);
    const fetchContentsHandler = new FetchContentsHandler(this.baseURL);
    const fetchYAMLFileHandler = new FetchYAMLFileHandler();
    const fetchWebhooksHandler = new FetchWebhooksHandler(this.baseURL);

    fetchUserHandler
        .setNext(fetchRepoDetailsHandler)
        .setNext(fetchContentsHandler)
        .setNext(fetchYAMLFileHandler)
        .setNext(fetchWebhooksHandler);

    const result = await fetchUserHandler.handle(request);

    return new CodeRepository(
        result.repoData.name,
        result.repoData.size,
        result.repoData.owner.login,
        result.repoData.private,
        result.files.length,
        result.ymlFileContent,
        result.activeWebhooks
    );
  }
}
