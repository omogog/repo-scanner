import { CodeRepository } from '../entities';

export interface GitClient {
  listRepositories(token: string): Promise<CodeRepository[]>;
  getRepositoryDetails(
    token: string,
    repoName: string
  ): Promise<CodeRepository>;
}
