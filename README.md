# @cloud9-labs/mcp-github

MCP (Model Context Protocol) server for GitHub API integration. This server provides comprehensive tools for interacting with GitHub repositories, issues, pull requests, branches, and code search through a unified interface.

## Features

- **Repository Management**: List, get, and create repositories
- **Issue Tracking**: List, get, create, and update GitHub issues
- **Pull Requests**: List, get, and create pull requests
- **Branch Management**: List and manage repository branches
- **File Content**: Retrieve file contents from repositories
- **Search**: Search repositories and code across GitHub
- **Commit History**: Access commit information and history

## Installation

### Prerequisites

- Node.js 18.0 or higher
- A GitHub Personal Access Token

### Setup Instructions

1. **Create a GitHub Personal Access Token**:
   - Go to [GitHub Settings - Personal Access Tokens](https://github.com/settings/tokens)
   - Click "Generate new token" (choose "Tokens (classic)")
   - Grant the following scopes:
     - `repo` - Full control of private repositories
     - `read:user` - Read user profile data
   - Copy the generated token (you won't be able to see it again\!)

2. **Configure Claude Desktop**:

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@cloud9-labs/mcp-github"],
      "env": {
        "GITHUB_TOKEN": "your-personal-access-token-here"
      }
    }
  }
}
```

**Config file locations**:
- macOS/Linux: `~/.config/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. **Restart Claude Desktop** to load the new MCP server.

## Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `github_list_repos` | List repositories for the authenticated user | `sort`, `direction`, `per_page`, `page` |
| `github_get_repo` | Get details of a specific repository | `owner`, `repo` |
| `github_create_repo` | Create a new repository for the authenticated user | `name`, `description`, `private`, `auto_init` |
| `github_list_issues` | List issues for a repository | `owner`, `repo`, `state`, `labels`, `per_page`, `page` |
| `github_get_issue` | Get details of a specific issue | `owner`, `repo`, `issue_number` |
| `github_create_issue` | Create a new issue in a repository | `owner`, `repo`, `title`, `body` |
| `github_update_issue` | Update an existing issue | `owner`, `repo`, `issue_number`, `title`, `body`, `state` |
| `github_list_pull_requests` | List pull requests for a repository | `owner`, `repo`, `state`, `per_page`, `page` |
| `github_get_pull_request` | Get details of a specific pull request | `owner`, `repo`, `pull_number` |
| `github_create_pull_request` | Create a new pull request | `owner`, `repo`, `title`, `body`, `head`, `base` |
| `github_list_branches` | List branches in a repository | `owner`, `repo`, `per_page`, `page` |
| `github_get_file_content` | Get the contents of a file in a repository | `owner`, `repo`, `path`, `ref` |
| `github_search_repos` | Search for repositories on GitHub | `query`, `sort`, `order`, `per_page`, `page` |
| `github_search_code` | Search for code across GitHub repositories | `query`, `language`, `per_page`, `page` |
| `github_list_commits` | List commits in a repository | `owner`, `repo`, `sha`, `per_page`, `page` |

## Usage Examples

### List Your Repositories

```
User: "Show me my GitHub repositories"
Claude will use: github_list_repos with pagination parameters
Response: A formatted list of your repositories with key information
```

### Search for Repositories

```
User: "Find popular Python repositories related to AI"
Claude will use: github_search_repos with query and sort parameters
Response: A curated list of matching repositories
```

### Create an Issue

```
User: "Create a new issue in my-project repository titled 'Bug: Login failure'"
Claude will use: github_create_issue with owner, repo, title, and body
Response: Confirmation with the new issue details including issue number
```

### Get Pull Request Details

```
User: "Show me the details of pull request #42 in owner/repo"
Claude will use: github_get_pull_request
Response: Complete PR information including status, reviews, and commits
```

### View File Contents

```
User: "Show me the contents of package.json from owner/repo"
Claude will use: github_get_file_content with path parameter
Response: File contents with optional base64 decoding
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes | GitHub Personal Access Token for API authentication |

## Authentication

The server uses GitHub's REST API v3 with personal access token authentication. Make sure your token has the appropriate scopes:

- `repo` - For repository access and management
- `read:user` - For reading user profile information

**Security Note**: Never commit your `GITHUB_TOKEN` to version control. Use environment variables or configuration files that are in `.gitignore`.

## Development

### Build from Source

```bash
git clone https://github.com/cloud9-labs/mcp-github.git
cd mcp-github
# Install dependencies and build
npm run build
```

### Watch Mode (for development)

```bash
npm run dev
```

This will continuously compile TypeScript as you make changes.

## Error Handling

The server provides detailed error messages for:

- Authentication failures (invalid or expired token)
- Rate limiting (GitHub API rate limits)
- Resource not found (non-existent repositories, issues, etc.)
- Validation errors (invalid parameters)
- Network errors (connectivity issues)

All errors are returned in a structured format with the `isError` flag set to `true`.

## GitHub API Rate Limits

- **Authenticated requests**: 5,000 requests per hour
- **Search API**: 30 requests per minute
- **GraphQL API**: 5,000 points per hour

Monitor your rate limit usage to avoid hitting these limits during intensive operations.

## Troubleshooting

### "Error: Invalid GITHUB_TOKEN"

- Verify your token is correctly set in the environment
- Ensure the token hasn't expired in GitHub settings
- Check that the token has the required scopes (`repo`, `read:user`)

### "Error: Repository not found"

- Verify the repository name and owner are correct
- Ensure your token has access to private repositories (if applicable)
- Check repository visibility settings

### "Error: Rate limit exceeded"

- Wait for the rate limit to reset (usually 1 hour)
- Reduce the frequency of requests
- Use pagination with `per_page` and `page` parameters efficiently

### MCP Server Not Loading

- Verify the MCP server is correctly configured in `claude_desktop_config.json`
- Check that your `GITHUB_TOKEN` environment variable is set
- Restart Claude Desktop after making configuration changes
- Check the Claude logs for detailed error messages

## API Reference

For detailed GitHub API documentation, visit:
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub Personal Access Token Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

## Support

For issues, questions, or contributions:
- GitHub Issues: [cloud9-labs/mcp-github/issues](https://github.com/cloud9-labs/mcp-github/issues)
- GitHub Discussions: [cloud9-labs/mcp-github/discussions](https://github.com/cloud9-labs/mcp-github/discussions)

## License

MIT

## Changelog

### Version 0.1.0

Initial release with 15 core tools:
- Repository management (list, get, create)
- Issue management (list, get, create, update)
- Pull request management (list, get, create)
- Branch operations (list)
- File content retrieval
- Repository and code search
- Commit history access
