import axios, { AxiosRequestConfig } from 'axios';
import { GitClient } from '../../domain/abstractions';
import { CodeRepository } from '../../domain/entities';

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
    let activeWebhooks: string[] = [];

    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const userResponse = await axios.get(`${this.baseURL}/user`, config);

    const repoResponse = await axios.get(
      `${this.baseURL}/repos/${userResponse.data.login}/${repoName}`,
      config
    );
    const repoData = repoResponse.data;

    const contentsResponse = await axios.get(
      `${this.baseURL}/repos/${userResponse.data.login}/${repoName}/contents`,
      config
    );
    const files = contentsResponse.data;
    const fileCount = files.length;

    let ymlFileContent;
    const ymlFile = files.find((file: any) => file.name.endsWith('.yml'));
    if (ymlFile) {
      const ymlFileResponse = await axios.get(ymlFile.download_url);
      ymlFileContent = ymlFileResponse.data;
    }

    try {
      const hooksResponse = await axios.get(
        `${this.baseURL}/repos/${userResponse.data.login}/${repoName}/hooks`,
        config
      );

      activeWebhooks = hooksResponse.data.map((hook: any) => hook.config.url);
    } catch (e) {
      // need to be discussed should we continue ot throw error when have no access to webhooks
      console.error('Error fetching webhooks or have no access', e);
    }

    return new CodeRepository(
      repoData.name,
      repoData.size,
      repoData.owner.login,
      repoData.private,
      fileCount,
      ymlFileContent,
      activeWebhooks
    );
  }
}
