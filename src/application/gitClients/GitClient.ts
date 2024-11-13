import { RepositorySummary, RepositoryDetails } from '../../domain/entitities';
export interface GitClient {
  listRepositories(token: string, page: number): Promise<RepositorySummary[]>;
  getRepositoryDetails(
    token: string,
    repoName: string
  ): Promise<RepositoryDetails>;
}
