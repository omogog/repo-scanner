import { GitClient } from "../gitClients";
import { Cache } from "../storages";;
import { RepositorySummary } from "../../domain/entitities";

export class ListRepositories {
  constructor(
      private gitClient: GitClient,
      private cache: Cache<RepositorySummary[]>,
  ) {}

  async execute(token: string, page = 1): Promise<RepositorySummary[]> {
    const cacheKey = `repos:page:${token}:${page}`;

    return this.cache.getOrFetch(cacheKey, async () =>
        this.gitClient.listRepositories(token, page)
    );
  }
}