export class RepositorySummary {
  constructor(public name: string, public size: number, public owner: string) {}
}

export class RepositoryDetails extends RepositorySummary {
  constructor(
      name: string,
      size: number,
      owner: string,
      public isPrivate: boolean,
      public fileCount: number,
      public ymlFileContent?: string,
      public activeWebhooks?: string[]
  ) {
    super(name, size, owner);
  }
}