import { GitClient } from '../gitClients';
import { Cache } from '../storages';
import { Queue } from '../queues';
import { RepositoryDetails } from '../../domain/entitities';

export class GetRepositoryDetails {
  constructor(
    private gitClient: GitClient,
    private cache: Cache<RepositoryDetails>,
    private queue: Queue<RepositoryDetails>
  ) {}

  async execute(token: string, repoName: string): Promise<RepositoryDetails> {
    const cacheKey = `repo:${token}:${repoName}`;

    return this.cache.getOrFetch(cacheKey, () =>
      this.queue.add(async () => {
        const details = await this.gitClient.getRepositoryDetails(
          token,
          repoName
        );
        this.cache.set(cacheKey, details);
        return details;
      })
    );
  }
}
