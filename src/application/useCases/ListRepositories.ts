import { GitClient } from '../../domain/abstractions';
import { CodeRepository } from '../../domain/entities';

export class ListRepositories {
  constructor(private gitClient: GitClient) {}

  async execute(token: string): Promise<CodeRepository[]> {
    return this.gitClient.listRepositories(token);
  }
}
