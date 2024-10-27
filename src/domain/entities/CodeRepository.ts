export class CodeRepository {
  constructor(
    public name: string,
    public size: number,
    public owner: string,
    public isPrivate?: boolean,
    public fileCount?: number,
    public ymlFileContent?: string,
    public activeWebhooks?: string[]
  ) {}
}
