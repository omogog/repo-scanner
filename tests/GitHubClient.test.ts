import {GitHubClient} from "../src/infrastructure/gitClients";
import {HttpClient} from "../src/application/http";
import { HttpClientFactory } from "../src/infrastructure/http/HttpClientFactory";
import {ContentFile, RepoData, UserData, Webhook} from "../src/infrastructure/gitClients/types";
import {RepositoryDetails, RepositorySummary} from "../src/domain/entitities";


jest.mock("../src/infrastructure/http/HttpClientFactory");

describe("GitHubClient", () => {
    let gitHubClient: GitHubClient;
    let mockHttpClient: jest.Mocked<HttpClient>;

    const baseURL = "https://api.github.com";
    const token = "test-token";

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
        } as any;
        (HttpClientFactory.create as jest.Mock).mockReturnValue(mockHttpClient);
        gitHubClient = new GitHubClient(baseURL);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("listRepositories", () => {
        it("should fetch user repositories and transform to RepositorySummary", async () => {
            const repoData: RepoData[] = [
                { name: "repo1", size: 100, owner: { login: "user1" }, private: false },
                { name: "repo2", size: 200, owner: { login: "user2" }, private: false },
            ];
            mockHttpClient.get.mockResolvedValue(repoData);

            const result = await gitHubClient.listRepositories(token, 1);

            expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseURL}/user/repos`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { per_page: 10, page: 1 },
            });
            expect(result).toEqual([
                new RepositorySummary("repo1", 100, "user1"),
                new RepositorySummary("repo2", 200, "user2"),
            ]);
        });
    });

    describe("getRepositoryDetails", () => {
        it("should fetch repository details, contents, and webhooks", async () => {
            const userData: UserData = { login: "user1" };
            const repoData: RepoData = { name: "repo1", size: 100, owner: { login: "user1" }, private: false };
            const contentFiles: ContentFile[] = [{ name: "file.yml", download_url: "http://example.com/file.yml" }];
            const webhooks: Webhook[] = [{ config: { url: "http://webhook.url" } }];
            const ymlContent = "yaml content";

            mockHttpClient.get
                .mockResolvedValueOnce(userData) // fetchUserLogin
                .mockResolvedValueOnce(repoData) // fetchRepositoryData
                .mockResolvedValueOnce(contentFiles) // fetchRepositoryContents
                .mockResolvedValueOnce(webhooks) // fetchRepositoryWebhooks
                .mockResolvedValueOnce(ymlContent); // fetchYmlFileContent

            const result = await gitHubClient.getRepositoryDetails(token, "repo1");

            expect(result).toEqual(
                new RepositoryDetails(
                    "repo1",
                    100,
                    "user1",
                    false,
                    1,
                    ymlContent,
                    ["http://webhook.url"]
                )
            );
            expect(mockHttpClient.get).toHaveBeenCalledTimes(5);
        });

        it("should handle missing YML file in repository contents", async () => {
            const userData: UserData = { login: "user1" };
            const repoData: RepoData = { name: "repo1", size: 100, owner: { login: "user1" }, private: false };
            const contentFiles: ContentFile[] = [{ name: "README.md", download_url: "http://example.com/readme.md" }];
            const webhooks: Webhook[] = [{ config: { url: "http://webhook.url" } }];

            mockHttpClient.get
                .mockResolvedValueOnce(userData) // fetchUserLogin
                .mockResolvedValueOnce(repoData) // fetchRepositoryData
                .mockResolvedValueOnce(contentFiles) // fetchRepositoryContents
                .mockResolvedValueOnce(webhooks); // fetchRepositoryWebhooks

            const result = await gitHubClient.getRepositoryDetails(token, "repo1");

            expect(result.ymlFileContent).toBeUndefined();
        });

        it("should return an empty array for webhooks if fetching webhooks fails", async () => {
            const userData: UserData = { login: "user1" };
            const repoData: RepoData = { name: "repo1", size: 100, owner: { login: "user1" }, private: false };
            const contentFiles: ContentFile[] = [{ name: "file.yml", download_url: "http://example.com/file.yml" }];
            const ymlContent = "yaml content";

            mockHttpClient.get
                .mockResolvedValueOnce(userData)
                .mockResolvedValueOnce(repoData)
                .mockResolvedValueOnce(contentFiles)
                .mockRejectedValueOnce(new Error("Webhooks fetch failed"))
                .mockResolvedValueOnce(ymlContent);

            const result = await gitHubClient.getRepositoryDetails(token, "repo1");

            expect(result.activeWebhooks).toEqual([]);
        });
    });

    describe("createAuthConfig", () => {
        it("should create authorization config with token", () => {
            const params = { page: 1, per_page: 10 };
            const result = (gitHubClient as any).createAuthConfig(token, params);
            expect(result).toEqual({
                headers: { Authorization: `Bearer ${token}` },
                params,
            });
        });
    });

    describe("fetchYmlFileContent", () => {
        it("should fetch YML file content if YML file exists", async () => {
            const contentFiles: ContentFile[] = [
                { name: "config.yml", download_url: "http://example.com/config.yml" },
            ];
            const ymlContent = "yaml content";
            mockHttpClient.get.mockResolvedValueOnce(ymlContent);

            const result = await (gitHubClient as any).fetchYmlFileContent(contentFiles);

            expect(result).toBe(ymlContent);
            expect(mockHttpClient.get).toHaveBeenCalledWith("http://example.com/config.yml");
        });

        it("should return undefined if no YML file is present", async () => {
            const contentFiles: ContentFile[] = [{ name: "README.md", download_url: "http://example.com/readme.md" }];
            const result = await (gitHubClient as any).fetchYmlFileContent(contentFiles);

            expect(result).toBeUndefined();
        });
    });
});