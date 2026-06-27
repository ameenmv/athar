# Athar

> **Every mistake leaves a trace, every lesson leaves an impact.**

Athar is an open-source, local-first MCP (Model Context Protocol) server designed to capture non-trivial software engineering lessons from your daily AI-assisted coding sessions. It operates silently in the background, intercepting teachable moments, storing them in a local SQLite database, and reinforcing long-term retention via a Spaced Repetition System (SM-2).

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-≥20-339933?logo=node.js&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Protocol-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)
![SQLite](https://img.shields.io/badge/SQLite-Local--First-003B57?logo=sqlite&logoColor=white)

</div>

---

## What is Athar?

**Athar** (أثر) acts as an engineering memory system. By integrating natively with MCP-compatible IDEs (such as Antigravity IDE, Cursor, and VS Code), it bridges the gap between solving a bug and actually learning from it.

When you resolve a complex issue with your AI assistant, the AI evaluates the architectural or pedagogical value of the fix. If deemed valuable, the AI autonomously invokes Athar to capture the problem, root cause, code diffs, and review questions. Later, you can leverage Athar's built-in spaced repetition CLI or Nuxt 4 web dashboard to permanently commit these insights to memory.

### Architecture

```
┌─────────────────────┐     stdio      ┌──────────────────┐
│   Antigravity IDE   │ ◄────────────► │   Athar MCP      │
│   (AI Assistant)    │   JSON-RPC     │   Server         │
└─────────────────────┘                └────────┬─────────┘
                                                │
                                       ┌────────▼─────────┐
                                       │   SQLite DB      │
                                       │   (local-first)  │
                                       │   ~/.local/share/│
                                       │   athar/lessons  │
                                       └────────┬─────────┘
                                                │
                                       ┌────────▼─────────┐
                                       │ CLI & Dashboard  │
                                       │ athar review     │
                                       │ athar dashboard  │
                                       └──────────────────┘
```

---

## Features

- **MCP Integration**: Native integration with standard MCP-compatible IDEs via stdio transport.
- **Autonomous Knowledge Capture**: AI autonomously filters and saves high-value engineering lessons.
- **Quality Validation Pipeline**: Automatic rejection of trivial modifications (e.g., typos, linting) and FTS5-based duplicate detection.
- **Spaced Repetition Engine**: Built-in SuperMemo-2 (SM-2) algorithm calculates dynamic review intervals based on recall accuracy.
- **Visual Analytics Dashboard**: A bundled, locally-served Nuxt 4 application offering side-by-side code diffs and mastery metrics.
- **Local-First & Privacy Preserving**: Zero telemetry. 100% of your data remains on your local filesystem using `node:sqlite`.

---

## Setup Guide

### Requirements
- **Node.js**: v20.0.0 or higher (Strict requirement for native `node:sqlite`).
- **IDE**: Any MCP-compatible IDE.

### 1. Global Installation

Install the package globally via npm:

```bash
npm install -g athar-mcp
```

### 2. IDE Integration

To register the MCP server with your IDE, execute the automated setup command:

```bash
athar setup
```

This utility will locate your IDE configuration (e.g., `mcp_config.json`) and automatically inject the local server binary. 

> **Critical**: After running setup, restart your IDE or execute a refresh of your MCP servers list to guarantee the tools are registered in the LLM context.

---

## Command Line Interface (CLI)

Athar is primarily managed via its robust CLI interface.

### Active Review
To execute your daily spaced repetition session:
```bash
athar review
```
*The CLI will sequentially prompt you with technical questions generated from past bugs. Grade your response accuracy (0-5) to inform the SM-2 scheduling algorithm.*

### Dashboard
Launch the visual web interface:
```bash
athar dashboard
```
*This initiates a Nitro server on `http://127.0.0.1:3333`, providing access to your full lesson repository and analytics.*

### Data Management
- **`athar status`**: Check pending review queues and mastery distribution.
- **`athar list --language typescript --tag architecture`**: Search and filter your local engineering memory.

---

## AI Heuristics: When are lessons saved?

The MCP server maintains strict system prompts instructing the IDE's AI assistant. Lessons are actively captured during:
- Resolution of **non-trivial logic bugs** with identifiable root causes.
- Correction of **fundamental misconceptions** regarding APIs or frameworks.
- Identification of **architectural anti-patterns** or security vulnerabilities.

Lessons are intentionally bypassed for:
- Syntax formatting or styling preferences.
- Standard boilerplate generation.
- Repetitive, previously mastered content.

---

## License

[MIT](LICENSE) — Maintained by [Ameen](https://github.com/ameenmv).
