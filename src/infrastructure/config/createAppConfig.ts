import { GitHubClient } from '../gitClients';
import { ListRepositories } from '../../application/useCases';
import { GetRepositoryDetails } from '../../application/useCases';
import { InMemoryCache } from '../storage';
import { InMemoryQueue } from '../storage/InMemoryQueue';
import { CodeRepository } from '../../domain/entities';

export const createAppConfig = () => {
  const baseURL = <string>process.env.GITHUB_API_URL || 'https://api.github.com';
  const cacheTTL = parseInt(<string>process.env.CACHE_TTL || '300', 10);
  const maxConcurrentRequests = parseInt(
    <string>process.env.MAX_CONCURRENT_REQUESTS || '2',
    10
  );

  const gitClient = new GitHubClient(baseURL);
  const cache = new InMemoryCache<CodeRepository>();
  const queue = new InMemoryQueue(maxConcurrentRequests);

  const listRepositories = new ListRepositories(gitClient);
  const getRepositoryDetails = new GetRepositoryDetails(
    gitClient,
    cache,
    queue,
    cacheTTL
  );

  return {
    listRepositories,
    getRepositoryDetails,
    cache,
  };
};
