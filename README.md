
# GitHub Scanner

This is a GitHub Scanner system built with TypeScript and Clean Architecture principles. The system uses an Apollo GraphQL server to allow users to:
1. View a list of repositories
2. Get detailed information about a specific repository

## Key Features
- **Concurrency Control**: Limits the number of concurrent requests when fetching repository details to avoid overloading the GitHub API.
- **Caching**: Uses an in-memory cache to store results and reduce repeated API requests.
- I’m not very familiar with GraphQL, so this might not be the best approach to implement it.
- The implemented solution avoids race conditions and also addresses potential race conditions with concurrent cache requests.
- The current implementation is designed to be as simple as possible, with scalability in mind. I aimed to use the minimum number of packages, following a clean architecture approach. For this implementation, I avoided using any external dependency injection containers; everything is done manually.
## Setup

### Prerequisites
- Node.js (>= 20.x)
- npm or yarn

### Instructions

1. Clone the repository and navigate to the project root.

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example file:
   ```bash
   cp .env.example .env
   ```

4. Set up your `.env` file with the following values:
   ```env
   GITHUB_API_URL=https://api.github.com
   PORT=4000
   CACHE_TTL=10
   MAX_CONCURRENT_REQUESTS=2
   NODE_ENV=development
   ```

### Running the Server
Start the Apollo GraphQL server:
```bash
npm run start
```

The server should now be running on `http://localhost:4000`.

## Testing

To run the test suite, use the following command:
```bash
npm test
```

## Usage

### GraphQL API

#### 1. List Repositories
Query to fetch a list of repositories:
```graphql
query ListRepositories($page: Int!) {
  listRepositories(page: $page) {
    items {
      name
      size
      owner
    }
    page
  }
}
```

#### 2. Get Repository Details
Query to fetch details of a specific repository:
```graphql
query GetRepositoryDetails($repoName: String!) {
  getRepositoryDetails(repoName: $repoName) {
    name
    size
    owner
    isPrivate
    fileCount
    ymlFileContent
    activeWebhooks
  }
}
```

### Curl Examples

#### List Repositories
```bash
curl -X POST http://localhost:4000/graphql   -H "Content-Type: application/json"   -H "Authorization: Bearer YOUR_GITHUB_TOKEN"   -d '{"query": "query ListRepositories($page: Int!) { listRepositories(page: $page) { items { name size owner } page } }", "variables": {"page": 1}}'
```

#### Get Repository Details
```bash
curl -X POST http://localhost:4000/graphql   -H "Content-Type: application/json"   -H "Authorization: Bearer YOUR_GITHUB_TOKEN"   -d '{"query": "query GetRepositoryDetails($repoName: String!) { getRepositoryDetails(repoName: $repoName) { name size owner isPrivate fileCount ymlFileContent activeWebhooks } }", "variables": {"repoName": "repoA"}}'
```

## Abstractions

### Queue Abstraction
The `Queue` abstraction, implemented as `LinkedListQueue`, manages concurrency control for repository detail requests. It ensures only a limited number of tasks (defined by `MAX_CONCURRENT_REQUESTS`) run concurrently. This abstraction is useful for future scaling, allowing a queue system to limit other types of concurrent tasks across various modules.

### Cache Abstraction
The `Cache` abstraction, implemented as `InMemoryCache`, provides a basic caching layer with TTL (time-to-live) support and race condition prevention. The `getOrFetch` method prevents duplicate requests by ensuring only one request per unique key is in-flight at a time. This makes it easy to scale the caching strategy and supports swapping with a more persistent cache, such as Redis, in the future.

