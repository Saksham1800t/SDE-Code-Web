---
title: AI Assistant & Agent Mode
description: Chat, autonomous Agent Mode, Repo mode, External Agents, and Parallel Threads.
order: 1
---

The Assistant panel has several modes, each suited to a different kind of task.

## Chat mode

Ask questions grounded in your open file and, if enabled, the project's indexed codebase. Responses stream in real time. You can copy a response, insert it directly into the active editor, or react with thumbs up/down. Conversations are saved automatically and stay in your history to resume later — you don't lose a thread by closing the panel.

## Agent Mode

Hand off a task and the model works autonomously: it reads files, searches the codebase, and proposes edits — creating, modifying, or deleting files — without touching disk immediately. Every proposed change lands in a **working set** you review and accept or reject, file by file.

Agent Mode can also run terminal commands, and can check a file's blast radius via the `analyze_code_impact` tool (see [Code Map & Impact Analysis](/docs/code-map)) before proposing a change. Whether a command or tool call needs your explicit approval first is controlled per-tool by **Agent Profiles** in Settings — a full allow/ask/deny matrix over each tool (`read_file`, `list_directory`, `search_files`, `propose_file_edit`, `create_file`, `delete_file`, `run_terminal_command`), with **Read-only**, **Full-Access**, and **Custom** presets. By default, file edits are staged for review automatically, while `run_terminal_command` always asks first.

## Project Rules & Memory

A persistent, per-workspace tab distinct from the four modes here — **Rules** are plain-language instructions ("Always use TypeScript strict mode") that get included in every AI conversation for that project; toggle a rule off to keep it without applying it, instead of deleting it. **Memory** is a simple key/value list of facts about the project (`framework` → `React 18 + Zustand`) that gets folded in the same way. Both are scoped to the current project and live in the Assistant panel's Memory tab.

## Inline completion

Ghost-text, AI-generated autocomplete-as-you-type in the editor — accept with `Tab`. It's a separate feature from Inline Chat (`Ctrl+I`, covered in [Editing & IntelliSense](/docs/editing)): completion suggests as you type, Inline Chat is an explicit, described edit. Toggle it from **Settings → Active AI Provider**.

## Repo mode ("Ask Repository")

A strictly read-only mode for asking questions about your project's *history* — commit history, blame, and code archaeology — using four dedicated git tools (`git_log`, `git_show`, `git_blame`, `git_search`). It never edits files or runs commands.

## Parallel Agent Threads

Run several Agent Mode conversations at once, each fully isolated in its own git worktree and branch. One thread's file changes never interfere with another's, or with your main working tree. Discard a thread to delete its worktree, or keep working across several in parallel from the Threads panel.

## External Agent Integration

Prefer a different coding agent entirely — Aider, the Claude Code CLI, or a custom script? Configure it once in **Settings → External Agents** (command + arguments), and run it from the Assistant panel's External mode. It runs as a fully autonomous subprocess with its output streamed read-only into the panel; it owns its own file edits and reasoning, unlike Agent Mode's staged-working-set model.

## MCP servers

SDE Code is a Model Context Protocol client — connect any MCP server from **Settings → MCP Servers** to extend the AI tool surface with whatever that server exposes, namespaced alongside the built-in and extension-contributed tools.
