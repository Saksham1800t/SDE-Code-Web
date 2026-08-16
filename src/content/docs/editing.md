---
title: Editing & IntelliSense
description: Real language-server intelligence, multi-file editing, and editor features.
order: 2
---

## Language intelligence

SDE Code speaks the real Language Server Protocol (LSP) — for Python, it spawns and talks to `pyright`. That gets you genuine completion, hover documentation, go-to-definition, and live diagnostics, not a heuristic approximation. Extensions can contribute additional language servers via `contributes.languageServers` in their manifest.

## Multibuffer editing

Open a synthetic, editable document assembled from excerpts of several real files at once — useful for reviewing or editing a scattered set of related changes without tab-switching. Edits write back to each source file individually when you save.

## Vim mode

Enable Vim keybindings from Settings for modal editing throughout the main editor.

## Inline Chat

Press `Ctrl+I` with a selection to open Inline Chat — describe an edit in place and apply it directly to the selected code without leaving the editor.

## Snippets

Define your own code snippets per language from **Settings → Text Editor → Snippets**, or use ones contributed by extensions.

## Search & bulk rename

Project-wide find/replace supports regex, whole-word, and case-sensitive matching. A **Search Editor** saves a search's results as a re-runnable, editable document. Cross-file symbol renames get a full preview across every affected file before anything is written.

## Local History

Every save is snapshotted per file, browsable from the Timeline view in the Explorer — restore an earlier version without needing git.
