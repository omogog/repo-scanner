import { GitClient } from '../../domain/abstractions';
import { Cache } from '../../domain/abstractions';
import { Queue } from '../../domain/abstractions/Queue';
import { CodeRepository } from '../../domain/entities';

export class GetRepositoryDetails {
  private readonly cacheTTL: number;

  constructor(
    private gitClient: GitClient,
    private cache: Cache<CodeRepository>,
    private queue: Queue,
    cacheTTL: number
  ) {
    this.cacheTTL = cacheTTL;
  }

  async execute(token: string, repoName: string): Promise<CodeRepository> {
    const cacheKey = `repo:${repoName}`;
    if (this.cache.has(cacheKey))
      return this.cache.get(cacheKey) as CodeRepository;

    return this.queue.add(async () => {
      const repoDetails = await this.gitClient.getRepositoryDetails(
        token,
        repoName
      );
      this.cache.set(cacheKey, repoDetails, this.cacheTTL);
      return repoDetails;
    });
  }
}
