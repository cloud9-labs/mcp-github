import { z } from "zod";

// Pagination schema
const PaginationSchema = z.object({
  page: z.number().optional().describe("Page number"),
  per_page: z.number().optional().describe("Results per page (max 100)"),
});

// Repository schemas
export const ListReposSchema = z.object({
  type: z.enum(["all", "owner", "public", "private", "member"]).optional().describe("Repository type filter"),
  sort: z.enum(["created", "updated", "pushed", "full_name"]).optional().describe("Sort order"),
  page: z.number().optional().describe("Page number"),
  per_page: z.number().optional().describe("Results per page"),
});

export const GetRepoSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
});

export const CreateRepoSchema = z.object({
  name: z.string().describe("Repository name"),
  description: z.string().optional().describe("Repository description"),
  private: z.boolean().optional().describe("Create as private repository"),
  auto_init: z.boolean().optional().describe("Initialize with README"),
});

// Issue schemas
export const ListIssuesSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  state: z.enum(["open", "closed", "all"]).optional().describe("Issue state filter"),
  labels: z.string().optional().describe("Comma-separated list of label names"),
  page: z.number().optional().describe("Page number"),
  per_page: z.number().optional().describe("Results per page"),
});

export const GetIssueSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  issue_number: z.number().describe("Issue number"),
});

export const CreateIssueSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  title: z.string().describe("Issue title"),
  body: z.string().optional().describe("Issue body content"),
  labels: z.array(z.string()).optional().describe("Array of label names"),
  assignees: z.array(z.string()).optional().describe("Array of usernames to assign"),
});

export const UpdateIssueSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  issue_number: z.number().describe("Issue number"),
  title: z.string().optional().describe("Issue title"),
  body: z.string().optional().describe("Issue body content"),
  state: z.enum(["open", "closed"]).optional().describe("Issue state"),
  labels: z.array(z.string()).optional().describe("Array of label names"),
});

// Pull Request schemas
export const ListPullRequestsSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  state: z.enum(["open", "closed", "all"]).optional().describe("PR state filter"),
  head: z.string().optional().describe("Filter by head user or branch (user:ref-name)"),
  base: z.string().optional().describe("Filter by base branch"),
  page: z.number().optional().describe("Page number"),
  per_page: z.number().optional().describe("Results per page"),
});

export const GetPullRequestSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  pull_number: z.number().describe("Pull request number"),
});

export const CreatePullRequestSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  title: z.string().describe("Pull request title"),
  head: z.string().describe("The name of the branch where your changes are"),
  base: z.string().describe("The name of the branch you want changes pulled into"),
  body: z.string().optional().describe("Pull request description"),
  draft: z.boolean().optional().describe("Create as draft PR"),
});

// Branch schemas
export const ListBranchesSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  page: z.number().optional().describe("Page number"),
  per_page: z.number().optional().describe("Results per page"),
});

// Content schemas
export const GetFileContentSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  path: z.string().describe("File path in repository"),
  ref: z.string().optional().describe("Branch, tag, or commit SHA"),
});

// Search schemas
export const SearchReposSchema = z.object({
  query: z.string().describe("Search query (e.g., 'react stars:>1000')"),
  sort: z.enum(["stars", "forks", "help-wanted-issues", "updated"]).optional().describe("Sort field"),
  order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
  page: z.number().optional().describe("Page number"),
  per_page: z.number().optional().describe("Results per page"),
});

export const SearchCodeSchema = z.object({
  query: z.string().describe("Search query (e.g., 'addClass in:file language:js repo:jquery/jquery')"),
  sort: z.enum(["indexed"]).optional().describe("Sort field"),
  order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
  page: z.number().optional().describe("Page number"),
  per_page: z.number().optional().describe("Results per page"),
});

// Commit schemas
export const ListCommitsSchema = z.object({
  owner: z.string().describe("Repository owner username"),
  repo: z.string().describe("Repository name"),
  sha: z.string().optional().describe("Branch or commit SHA to start from"),
  path: z.string().optional().describe("Only commits containing this file path"),
  author: z.string().optional().describe("GitHub username or email address"),
  page: z.number().optional().describe("Page number"),
  per_page: z.number().optional().describe("Results per page"),
});
