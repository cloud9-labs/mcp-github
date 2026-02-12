import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GitHubClient } from "./client.js";
import {
  ListReposSchema,
  GetRepoSchema,
  CreateRepoSchema,
  ListIssuesSchema,
  GetIssueSchema,
  CreateIssueSchema,
  UpdateIssueSchema,
  ListPullRequestsSchema,
  GetPullRequestSchema,
  CreatePullRequestSchema,
  ListBranchesSchema,
  GetFileContentSchema,
  SearchReposSchema,
  SearchCodeSchema,
  ListCommitsSchema,
} from "./schemas.js";

function errorResult(error: unknown) {
  const message = error instanceof Error ? error.message : "An unknown error occurred";
  return {
    content: [{ type: "text" as const, text: `Error: ${message}` }],
    isError: true,
  };
}

export function registerTools(server: McpServer): void {
  let _client: GitHubClient | null = null;
  
  const getClient = () => {
    if (!_client) {
      _client = new GitHubClient();
    }
    return _client;
  };

  // Repository tools
  server.tool(
    "github_list_repos",
    "List repositories for the authenticated user",
    ListReposSchema.shape,
    async (params) => {
      try {
        const result = await getClient().listUserRepos(params);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "github_get_repo",
    "Get details of a specific repository",
    GetRepoSchema.shape,
    async (params) => {
      try {
        const result = await getClient().getRepo(params.owner, params.repo);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "github_create_repo",
    "Create a new repository for the authenticated user",
    CreateRepoSchema.shape,
    async (params) => {
      try {
        const result = await getClient().createRepo(params);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // Issue tools
  server.tool(
    "github_list_issues",
    "List issues for a repository",
    ListIssuesSchema.shape,
    async (params) => {
      try {
        const { owner, repo, ...filters } = params;
        const result = await getClient().listIssues(owner, repo, filters);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "github_get_issue",
    "Get details of a specific issue",
    GetIssueSchema.shape,
    async (params) => {
      try {
        const result = await getClient().getIssue(params.owner, params.repo, params.issue_number);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "github_create_issue",
    "Create a new issue in a repository",
    CreateIssueSchema.shape,
    async (params) => {
      try {
        const { owner, repo, ...data } = params;
        const result = await getClient().createIssue(owner, repo, data);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "github_update_issue",
    "Update an existing issue",
    UpdateIssueSchema.shape,
    async (params) => {
      try {
        const { owner, repo, issue_number, ...data } = params;
        const result = await getClient().updateIssue(owner, repo, issue_number, data);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // Pull Request tools
  server.tool(
    "github_list_pull_requests",
    "List pull requests for a repository",
    ListPullRequestsSchema.shape,
    async (params) => {
      try {
        const { owner, repo, ...filters } = params;
        const result = await getClient().listPullRequests(owner, repo, filters);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "github_get_pull_request",
    "Get details of a specific pull request",
    GetPullRequestSchema.shape,
    async (params) => {
      try {
        const result = await getClient().getPullRequest(params.owner, params.repo, params.pull_number);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "github_create_pull_request",
    "Create a new pull request",
    CreatePullRequestSchema.shape,
    async (params) => {
      try {
        const { owner, repo, ...data } = params;
        const result = await getClient().createPullRequest(owner, repo, data);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // Branch tools
  server.tool(
    "github_list_branches",
    "List branches in a repository",
    ListBranchesSchema.shape,
    async (params) => {
      try {
        const { owner, repo, ...pagination } = params;
        const result = await getClient().listBranches(owner, repo, pagination);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // Content tools
  server.tool(
    "github_get_file_content",
    "Get the contents of a file in a repository",
    GetFileContentSchema.shape,
    async (params) => {
      try {
        const { owner, repo, path, ref } = params;
        const result = await getClient().getFileContent(owner, repo, path, ref);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // Search tools
  server.tool(
    "github_search_repos",
    "Search for repositories on GitHub",
    SearchReposSchema.shape,
    async (params) => {
      try {
        const { query, ...options } = params;
        const result = await getClient().searchRepositories(query, options);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "github_search_code",
    "Search for code across GitHub repositories",
    SearchCodeSchema.shape,
    async (params) => {
      try {
        const { query, ...options } = params;
        const result = await getClient().searchCode(query, options);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // Commit tools
  server.tool(
    "github_list_commits",
    "List commits in a repository",
    ListCommitsSchema.shape,
    async (params) => {
      try {
        const { owner, repo, ...filters } = params;
        const result = await getClient().listCommits(owner, repo, filters);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
