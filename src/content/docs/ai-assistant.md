---
title: AI Assistant & Agent Mode
description: Chat, autonomous Agent Mode, Repo mode, External Agents, and Parallel Threads.
order: 1
---

The Assistant panel has several modes, each suited to a different kind of task.

## Chat mode

Ask questions grounded in your open file and, if enabled, the project's indexed codebase. Responses stream in real time. You can copy a response, insert it directly into the active editor, or react with thumbs up/down.

## Agent Mode

Hand off a task and the model works autonomously: it reads files, searches the codebase, and proposes edits — creating, modifying, or deleting files — without touching disk immediately. Every proposed change lands in a **working set** you review and accept or reject, file by file.

Agent Mode can also run terminal commands. Whether a command needs your explicit approval first is controlled per-tool by **Agent Profiles** in Settings — by default, file edits are staged for review automatically, while `run_terminal_command` always asks first.

## Repo mode ("Ask Repository")

A strictly read-only mode for asking questions about your project's *history* — commit history, blame, and code archaeology — using four dedicated git tools (`git_log`, `git_show`, `git_blame`, `git_search`). It never edits files or runs commands.

## Parallel Agent Threads

Run several Agent Mode conversations at once, each fully isolated in its own git worktree and branch. One thread's file changes never interfere with another's, or with your main working tree. Discard a thread to delete its worktree, or keep working across several in parallel from the Threads panel.

## External Agent Integration

Prefer a different coding agent entirely — Aider, the Claude Code CLI, or a custom script? Configure it once in **Settings → External Agents** (command + arguments), and run it from the Assistant panel's External mode. It runs as a fully autonomous subprocess with its output streamed read-only into the panel; it owns its own file edits and reasoning, unlike Agent Mode's staged-working-set model.

## MCP servers

SDE Code is a Model Context Protocol client — connect any MCP server from **Settings → MCP Servers** to extend the AI tool surface with whatever that server exposes, namespaced alongside the built-in and extension-contributed tools.
