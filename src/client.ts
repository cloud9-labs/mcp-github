export interface GitHubClientConfig {
  token: string;
  baseURL?: string;
  rateLimit?: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export class GitHubClient {
  private token: string;
  private baseURL: string;
  private rateLimit: number;
  private lastRequestTime: number = 0;
  private rateLimitInfo: RateLimitInfo | null = null;

  constructor(config?: Partial<GitHubClientConfig>) {
    const token = config?.token || process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GitHub token is required. Set GITHUB_TOKEN environment variable.");
    }
    this.token = token;
    this.baseURL = config?.baseURL || "https://api.github.com";
    this.rateLimit = config?.rateLimit || 10; // 10 requests per second
  }

  private async rateLimitDelay(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minDelay = 1000 / this.rateLimit;

    if (timeSinceLastRequest < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    await this.rateLimitDelay();

    const url = `${this.baseURL}${path}`;
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${this.token}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...customHeaders,
    };

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Extract rate limit information
    const limit = response.headers.get("X-RateLimit-Limit");
    const remaining = response.headers.get("X-RateLimit-Remaining");
    const reset = response.headers.get("X-RateLimit-Reset");

    if (limit && remaining && reset) {
      this.rateLimitInfo = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorText;
      } catch {
        errorMessage = errorText;
      }
      throw new Error(`GitHub API error (${response.status}): ${errorMessage}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text() as T;
  }

  // Repository methods
  async listUserRepos(params?: PaginationParams & { type?: string; sort?: string }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString());
    if (params?.type) queryParams.set("type", params.type);
    if (params?.sort) queryParams.set("sort", params.sort);

    const query = queryParams.toString();
    return this.request("GET", `/user/repos${query ? `?${query}` : ""}`);
  }

  async getRepo(owner: string, repo: string): Promise<any> {
    return this.request("GET", `/repos/${owner}/${repo}`);
  }

  async createRepo(data: {
    name: string;
    description?: string;
    private?: boolean;
    auto_init?: boolean;
  }): Promise<any> {
    return this.request("POST", "/user/repos", data);
  }

  // Issue methods
  async listIssues(
    owner: string,
    repo: string,
    params?: PaginationParams & { state?: string; labels?: string }
  ): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString());
    if (params?.state) queryParams.set("state", params.state);
    if (params?.labels) queryParams.set("labels", params.labels);

    const query = queryParams.toString();
    return this.request("GET", `/repos/${owner}/${repo}/issues${query ? `?${query}` : ""}`);
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<any> {
    return this.request("GET", `/repos/${owner}/${repo}/issues/${issueNumber}`);
  }

  async createIssue(
    owner: string,
    repo: string,
    data: { title: string; body?: string; labels?: string[]; assignees?: string[] }
  ): Promise<any> {
    return this.request("POST", `/repos/${owner}/${repo}/issues`, data);
  }

  async updateIssue(
    owner: string,
    repo: string,
    issueNumber: number,
    data: { title?: string; body?: string; state?: string; labels?: string[] }
  ): Promise<any> {
    return this.request("PATCH", `/repos/${owner}/${repo}/issues/${issueNumber}`, data);
  }

  // Pull Request methods
  async listPullRequests(
    owner: string,
    repo: string,
    params?: PaginationParams & { state?: string; head?: string; base?: string }
  ): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString());
    if (params?.state) queryParams.set("state", params.state);
    if (params?.head) queryParams.set("head", params.head);
    if (params?.base) queryParams.set("base", params.base);

    const query = queryParams.toString();
    return this.request("GET", `/repos/${owner}/${repo}/pulls${query ? `?${query}` : ""}`);
  }

  async getPullRequest(owner: string, repo: string, pullNumber: number): Promise<any> {
    return this.request("GET", `/repos/${owner}/${repo}/pulls/${pullNumber}`);
  }

  async createPullRequest(
    owner: string,
    repo: string,
    data: { title: string; head: string; base: string; body?: string; draft?: boolean }
  ): Promise<any> {
    return this.request("POST", `/repos/${owner}/${repo}/pulls`, data);
  }

  // Branch methods
  async listBranches(owner: string, repo: string, params?: PaginationParams): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString());

    const query = queryParams.toString();
    return this.request("GET", `/repos/${owner}/${repo}/branches${query ? `?${query}` : ""}`);
  }

  // Content methods
  async getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<any> {
    const queryParams = new URLSearchParams();
    if (ref) queryParams.set("ref", ref);

    const query = queryParams.toString();
    return this.request("GET", `/repos/${owner}/${repo}/contents/${path}${query ? `?${query}` : ""}`);
  }

  // Search methods
  async searchRepositories(
    query: string,
    params?: PaginationParams & { sort?: string; order?: string }
  ): Promise<any> {
    const queryParams = new URLSearchParams({ q: query });
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString());
    if (params?.sort) queryParams.set("sort", params.sort);
    if (params?.order) queryParams.set("order", params.order);

    return this.request("GET", `/search/repositories?${queryParams.toString()}`);
  }

  async searchCode(
    query: string,
    params?: PaginationParams & { sort?: string; order?: string }
  ): Promise<any> {
    const queryParams = new URLSearchParams({ q: query });
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString());
    if (params?.sort) queryParams.set("sort", params.sort);
    if (params?.order) queryParams.set("order", params.order);

    return this.request("GET", `/search/code?${queryParams.toString()}`);
  }

  // Commit methods
  async listCommits(
    owner: string,
    repo: string,
    params?: PaginationParams & { sha?: string; path?: string; author?: string }
  ): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.per_page) queryParams.set("per_page", params.per_page.toString());
    if (params?.sha) queryParams.set("sha", params.sha);
    if (params?.path) queryParams.set("path", params.path);
    if (params?.author) queryParams.set("author", params.author);

    const query = queryParams.toString();
    return this.request("GET", `/repos/${owner}/${repo}/commits${query ? `?${query}` : ""}`);
  }

  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }
}
