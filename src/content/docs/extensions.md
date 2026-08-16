---
title: Extensions
description: Install extensions from the marketplace, or build and publish your own.
order: 6
---

## Installing extensions

Open the Extensions panel from the Activity Bar to browse the marketplace — themes, language servers, debug adapters, snippets, and AI tools. Install with one click; enable or disable per-workspace without affecting your global setup.

## What extensions can contribute

An extension manifest can declare, among other things:

- **Themes** — full color themes, picked from Settings → Appearance
- **Language servers** (`contributes.languageServers`) — powers completion/hover/diagnostics for a language
- **Debug adapters** (`contributes.debugAdapters`) — powers the Debugger for a language
- **Language definitions** — syntax highlighting for a new language
- **Snippets**, **commands**, **walkthroughs**, and **AI tools** the Assistant can call

## Building your own

Scaffold a new extension with the SDK's CLI:

```bash
npx @sde-code/sdk init my-extension
```

This creates a working extension project you can develop against the same SDK types the built-in system extensions use.

## Publishing

Once ready, publish straight from the Extensions panel's **Publish** tab — it packages your extension and uploads it to the marketplace under your account, validated against your authenticated publisher identity.
