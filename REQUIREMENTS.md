# GitHub Scanner

Please implement a "GitHub Scanner" system in TypeScript.

Import the following repository to your own GitHub account under 3 different names (for example, repoA, repoB, repoC) to use as test data: https://github.com/roma8389/GreenridgeApp

**Note**: You can open a GitHub project for free.

Create an Apollo GraphQL server. The server needs to support 2 scenarios:

1. Show List of Repositories
2. Show Repository details for one repository

Make sure to accept a personal access token from GitHub as a parameter in the API and return the data that token has access to.

When fetching repository details, the server should only fetch details of up to 2 repositories in parallel for all incoming requests from all potential clients.

## List of Repositories

The list should contain the following information:
- Repo name
- Repo size
- Repo owner

## Repository Details

The details should contain the following information:
- Repo name
- Repo size
- Repo owner
- Private/public repo
- Number of files in the repo
- Content of 1 yml file (any one that appears in the repo)
- Active webhooks

## Notes

### Acceptance Criteria:
- Proper functionality
- Clean code
- KISS principle