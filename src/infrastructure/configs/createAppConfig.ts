import { GitHubClient } from '../gitClients';
import { InMemoryCache } from '../storages';
import { LinkedListQueue } from '../queues/LinkedListQueue';
import { ListRepositories } from '../../application/useCases';
import { GetRepositoryDetails } from '../../application/useCases';
import { config as loadEnv } from 'dotenv';
import { RepositoryDetails, RepositorySummary } from '../../domain/entitities';

loadEnv();

export const createAppConfig = () => {
  const baseURL =
    <string>process.env.GITHUB_API_URL || 'https://api.github.com';
  const cacheTTL = parseInt(<string>process.env.CACHE_TTL || '300', 10);
  const maxConcurrentRequests = parseInt(
    <string>process.env.MAX_CONCURRENT_REQUESTS || '2',
    10
  );

  const gitClient = new GitHubClient(baseURL);
  const repositorySummaryCache = new InMemoryCache<RepositorySummary[]>(
    cacheTTL
  );
  const repositoryDetailCache = new InMemoryCache<RepositoryDetails>(cacheTTL);

  const queue = new LinkedListQueue<RepositoryDetails>(maxConcurrentRequests);

  const listRepositories = new ListRepositories(
    gitClient,
    repositorySummaryCache
  );
  const getRepositoryDetails = new GetRepositoryDetails(
    gitClient,
    repositoryDetailCache,
    queue
  );

  return {
    listRepositories,
    getRepositoryDetails,
  };
};
