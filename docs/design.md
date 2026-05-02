# Agent Walker Design

## Product Shape

Agent Walker is a personal research inbox with a flow UI. It should feel closer to a work tool than a social feed: quiet, dense, fast to scan, and built around triage.

The core design principle is:

> Collect broadly, evaluate cheaply where possible, show narrowly.

The product should not create another timeline. It should create a small, high-signal reading queue.

## Architecture

```text
X List
  ↓ user-triggered collection
X API fetcher
  ↓ up to 200 recent posts
Raw post store
  ↓ dedupe by post id
New candidates
  ↓ Agent evaluation
Evaluations
  ↓ top ranked candidates
Inbox, max 50 posts
  ↓ user action
Read Later / Valuable / Skipped
```

## Suggested Stack

The first full implementation can use:

- Next.js / React for the UI.
- TypeScript for app code.
- SQLite for local-first persistence.
- Prisma or Drizzle for schema and migrations.
- OpenAI API for Agent scoring.
- X API v2 for List post collection.

The current prototype is static HTML/CSS/JS and should be treated as a visual and interaction reference, not the final app architecture.

## Data Model

### settings

Stores personal configuration.

```ts
type Settings = {
  id: string;
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
};
```

### tracked_lists

Stores X Lists to collect from.

```ts
type TrackedList = {
  id: string;
  platform: "x";
  xListId: string;
  name: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

### posts

Stores raw posts fetched from X.

```ts
type Post = {
  id: string;
  xPostId: string;
  xListId: string;
  authorName: string;
  authorHandle: string;
  text: string;
  url: string;
  postedAt: Date;
  fetchedAt: Date;
};
```

### evaluations

Stores Agent outputs.

```ts
type Evaluation = {
  id: string;
  postId: string;
  score: number;
  summary: string;
  reason: string;
  tags: string[];
  shouldShow: boolean;
  evaluatedAt: Date;
};
```

### user_actions

Stores user classification and preference data.

```ts
type UserAction = {
  id: string;
  postId: string;
  action: "read_later" | "valuable" | "skipped";
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};
```

## X API Collection Design

Use the X API List posts endpoint:

```text
GET /2/lists/:id/tweets
```

Initial policy:

- `max_results=100`
- Fetch up to two pages per collection run.
- Stop after 200 posts, no matter how many pages are available.
- Filter to the last 24 hours.
- Dedupe against stored `xPostId`.

Important implementation detail:

- The API fetch limit and UI display limit are separate.
- The fetcher may collect 200 posts.
- The Agent may select at most 50 posts for the Inbox.

## Agent Design

The Agent should receive a compact context packet:

- User system prompt.
- A small sample of recent `Valuable` posts.
- A small sample of recent `Read Later` posts.
- A small sample of recent `Skipped` posts.
- Candidate post text and metadata.

For MVP, favor a simple scoring pass over complex multi-agent orchestration.

Suggested evaluation rubric:

- Relevance to the system prompt.
- Practical usefulness.
- Novelty compared with previously saved items.
- Signal quality versus generic commentary.
- Fit with historical user actions.

The Agent should return structured JSON that maps directly to the UI.

## UI Design

### Sidebar

The sidebar contains:

- Product identity.
- Flow views:
  - Inbox
  - Read Later
  - Valuable
  - Skipped
- Topic views:
  - Agents
  - LLM Apps
  - AI UI
- Source status.
- Settings entry.

### Header

The header contains:

- Current view title.
- Collection status.
- `Collect last 24h` button.

Status examples:

- `Idle / 200 collected / 50 shown`
- `X API / Collecting up to 200`
- `Filtered / 38 of 50 shown`

### Feed

The feed is text-first and scan-friendly.

Post actions are hidden until hover to keep the feed light:

- `Read Later`
- `Valuable`
- `Skip`

### Detail Pane

The detail pane is always visible on desktop.

It provides the richer explanation surface:

- Agent summary.
- Why it matters.
- Tags.
- Notes.
- Original source link.

## Cost Control

Cost should be controlled at multiple layers:

- Manual collection instead of continuous background crawling.
- Maximum 200 fetched posts per run.
- Deduplicate before evaluation.
- Evaluate only new candidates.
- Display maximum 50 posts.
- Prefer compact preference examples in prompts.

## Future Extensions

Likely next phases:

- Link expansion and article extraction.
- Natural language search over saved `Valuable` posts.
- Additional sources such as RSS, GitHub, arXiv, Hacker News, and YouTube.
- Browser extension for manual capture.
- Weekly summary generation.
- More advanced preference learning.
