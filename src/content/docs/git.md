---
title: Git & GitHub
description: Source control, an interactive commit graph, and GitHub PR/issue review — built in.
order: 4
---

## Source Control panel

Stage, unstage, and discard changes per file or all at once; write commit messages with gitmoji shortcuts; push, pull, and fetch — all without leaving the editor. Merge conflicts get a dedicated three-pane resolution view.

## Embedded Git Graph

The sidebar shows a compact, lane-based commit graph per repository (multi-root workspaces get one section per nested repo, auto-discovered). Click a commit to expand its changed-file list inline; click a file to view its diff.

## Commit heatmap & code hotspots

A GitHub-style activity heatmap visualizes commit frequency over time. **Code Hotspots** surfaces the files that change most often — a useful signal for where technical debt or complexity tends to accumulate.

## GitHub integration

Sign in via GitHub's Device Flow (Settings → sign in) to review pull requests and issues without leaving SDE Code — browse PR file diffs, read and post comments, and submit full reviews (approve, request changes, or comment) with inline comments attached to specific lines.

## Worktrees

Create an isolated git worktree on a new branch directly from SDE Code — the mechanism [Parallel Agent Threads](/docs/ai-assistant) uses under the hood to keep concurrent AI-driven work from colliding with your main working tree.

## Local History as a safety net

Every file save is snapshotted independently of git, browsable from the Explorer's Timeline view — a second safety net for changes you haven't committed yet.
