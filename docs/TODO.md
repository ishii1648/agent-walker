# Agent Walker TODO

## Prototype

- [x] Build static three-pane UI prototype.
- [x] Add sidebar views for Inbox, Read Later, Valuable, Skipped, and Topics.
- [x] Add post selection and right detail pane.
- [x] Add hover actions on post rows.
- [x] Add `Collect last 24h` button.
- [x] Mock collection status and Inbox insertion.
- [x] Document MVP spec and design.

## Repository Setup

- [ ] Decide final app stack.
- [ ] Convert static prototype into app scaffold.
- [ ] Add README with product overview and local setup.
- [ ] Add formatter and linting.
- [ ] Add initial CI.

## Frontend

- [ ] Port prototype to React components.
- [ ] Create layout components for sidebar, feed, and detail pane.
- [ ] Implement view state for Inbox, Read Later, Valuable, Skipped, and Topics.
- [ ] Implement post action state transitions.
- [ ] Add settings UI for system prompt and X List id.
- [ ] Add collection progress states.
- [ ] Add empty states for each view.

## Backend

- [ ] Add persistence layer.
- [ ] Create schema for settings, tracked lists, posts, evaluations, and user actions.
- [ ] Implement post deduplication by X post id.
- [ ] Implement collection run recordkeeping.
- [ ] Add API route for `Collect last 24h`.
- [ ] Add API route for user actions.

## X API

- [ ] Configure X API credentials.
- [ ] Implement List posts fetcher.
- [ ] Fetch up to two pages with `max_results=100`.
- [ ] Filter posts to last 24 hours.
- [ ] Store only new posts.
- [ ] Handle rate limit and API errors.

## Agent Evaluation

- [ ] Define structured evaluation JSON schema.
- [ ] Implement relevance scoring prompt.
- [ ] Include system prompt in evaluation context.
- [ ] Include recent `Valuable`, `Read Later`, and `Skipped` examples.
- [ ] Evaluate only new posts.
- [ ] Select up to 50 posts for Inbox display.
- [ ] Persist score, summary, reason, tags, and display eligibility.

## Product Decisions

- [ ] Decide whether `Read Later` should remain in Inbox or move out immediately.
- [ ] Decide whether `Valuable` should require a note.
- [ ] Decide whether `Skipped` posts should be hidden permanently or recoverable.
- [ ] Decide how many historical preference examples to include in Agent prompts.
- [ ] Decide whether collection should support multiple X Lists in MVP.

## Later

- [ ] Link expansion and article extraction.
- [ ] Natural language search over saved posts.
- [ ] Browser extension for manual capture.
- [ ] Additional sources beyond X.
- [ ] Weekly digest.
