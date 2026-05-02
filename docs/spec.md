# Agent Walker Spec

## Overview

Agent Walker is a personal AI research inbox for collecting, filtering, and saving high-signal X posts from curated Lists.

The product is designed for a single user who currently follows AI-related influencers through X Lists and manually scrolls to find useful posts. Agent Walker replaces that workflow with an explicit collection action, AI filtering, and a lightweight three-pane reading interface.

## Problem

The current X List workflow has three main issues:

- Influencer posts vary in quality and relevance, so reading the raw timeline wastes attention.
- Valuable posts are easy to lose in search history, likes, bookmarks, or the feed itself.
- The user wants a learning and research workflow, not another endless feed.

## MVP Goal

Build a personal tool that:

- Collects recent posts from an X List only when the user asks.
- Limits collection to a small, predictable window.
- Uses an AI Agent to select only the most relevant posts.
- Lets the user classify selected posts as `Read Later`, `Valuable`, or `Skipped`.
- Uses saved actions as future preference signals.

## Core User Flow

1. User opens Agent Walker.
2. User presses `Collect last 24h`.
3. System fetches up to 200 posts from configured X Lists.
4. System deduplicates posts by X post id.
5. Agent scores and filters new candidates.
6. System shows up to 50 selected posts in `Inbox`.
7. User reviews posts in a Slack-like flow UI.
8. User marks posts as:
   - `Read Later`: interesting but not yet confirmed as valuable.
   - `Valuable`: read and worth keeping as a strong positive signal.
   - `Skipped`: not useful; future ranking should de-prioritize similar posts.

## Product Scope

### In Scope for MVP

- Single-user personal tool.
- X as the only data source.
- One or more configured X Lists.
- Manual collection via `Collect last 24h`.
- Maximum 200 collected posts per collection run.
- Maximum 50 posts displayed in the UI after Agent filtering.
- Three-pane UI:
  - Sidebar navigation.
  - Central post flow.
  - Right detail pane.
- Views:
  - Inbox
  - Read Later
  - Valuable
  - Skipped
  - Topic filters
- Configurable system prompt for relevance judgment.
- Persistent storage for posts, evaluations, settings, and user actions.

### Out of Scope for MVP

- Continuous background crawling.
- Multi-user workspace features.
- Other sources such as RSS, GitHub, arXiv, Hacker News, YouTube, or blogs.
- Natural language knowledge search.
- Weekly reports.
- Browser extension.
- Mobile-first UI.
- Automated posting, replying, liking, or other X write actions.

## Collection Rules

Collection should be explicit, not automatic.

Initial collection policy:

- Trigger: user presses `Collect last 24h`.
- Time window: last 24 hours.
- Fetch limit: up to 200 posts.
- X API strategy: call List posts endpoint with `max_results=100`, up to two pages per List.
- Deduplication: skip posts already stored by post id.
- Agent evaluation: only evaluate new posts.
- UI output: show up to 50 selected posts.

This keeps API usage, model cost, and human attention bounded.

## Agent Evaluation Inputs

The Agent should evaluate posts using:

- User system prompt.
- Previously marked `Valuable` posts as strong positive examples.
- Previously marked `Read Later` posts as weak positive examples.
- Previously marked `Skipped` posts as negative examples.
- Current post text.
- Author metadata.
- Links, if available in later phases.

## Agent Evaluation Outputs

For each candidate post, the Agent should produce:

- `score`: relevance score.
- `summary`: short summary.
- `reason`: why this post matters to the user.
- `tags`: topic labels.
- `shouldShow`: whether the post should be eligible for Inbox display.

## UI Requirements

### Layout

Use a fixed three-pane layout:

- Left sidebar for navigation and source status.
- Center pane for the post flow.
- Right pane for selected post details.

### Central Feed

The center feed should be lightweight and text-first.

Each post row should show:

- Author name.
- Handle.
- Time.
- Post text.
- Agent reason.
- Tags.
- Score as a compact indicator.

Action buttons should appear on hover:

- `Read Later`
- `Valuable`
- `Skip`

### Detail Pane

The right pane should always be visible on desktop and show:

- Selected author.
- Original X link.
- Full post text.
- Agent summary.
- Agent reason.
- Tags.
- Save note.
- Primary actions.

## Success Criteria

The MVP is successful if:

- The user can avoid raw X scrolling for AI research sessions.
- Collection feels bounded and intentional.
- The Inbox contains a small enough set of posts to review in one sitting.
- `Valuable` posts become easy to find again.
- User actions create useful preference data for the Agent.
