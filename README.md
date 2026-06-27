# Athar

Athar is an AI-powered programming memory assistant built on the Model Context Protocol (MCP). It passively captures non-trivial software engineering lessons from your daily coding sessions and ensures long-term retention using a Spaced Repetition System (SM-2).

By integrating directly with MCP-compatible IDEs (such as Antigravity IDE, Cursor, and VS Code via Cline), Athar transforms the AI assistant from a stateless oracle into a localized, context-aware mentor that understands your specific recurring mistakes.

---

## ⚠️ Requirements

- **Node.js**: v20.0.0 or higher (Strict requirement: relies on the experimental `node:sqlite` module).
- **IDE**: Any MCP-compatible IDE (Antigravity IDE, Cursor, VS Code).

---

## Installation

Install the package globally via npm:

```bash
npm install -g athar-mcp
```

### IDE Configuration

To register the MCP server with your IDE, run the automated setup command:

```bash
athar setup
```

This command automatically locates your `mcp_config.json` and injects the server path. 

> **Note**: After running setup, restart your IDE or manually refresh the MCP servers list to ensure the `athar` server and its tools (`save_lesson` and `memory`) are loaded.

#### Manual Configuration
If you prefer to configure your IDE manually or are using an unsupported IDE, add the following to your MCP configuration file:

```json
{
  "mcpServers": {
    "athar": {
      "command": "node",
      "args": [
        "--experimental-sqlite",
        "/absolute/path/to/global/node_modules/athar-mcp/dist/index.js"
      ]
    }
  }
}
```

---

## System Architecture & Workflow

Athar operates on a passive collection and active retrieval model.

### 1. Passive Collection (IDE Integration)
You do not need to manually interact with Athar while coding. As you prompt the IDE's AI assistant to resolve complex bugs or architectural issues, the AI evaluates the instructional value of the resolution. If the resolution is deemed non-trivial, the AI autonomously invokes the `save_lesson` MCP tool.

The data (problem statement, root cause, code diffs, and review questions) is written to a local SQLite database (`~/.local/share/athar/lessons.db`). This process occurs entirely in the background.

### 2. Context Retrieval
When encountering familiar issues, you may explicitly ask the IDE assistant to "search my memory." The assistant will invoke the `memory` MCP tool, executing a Full-Text Search (FTS5) against your local database to retrieve your historical solutions.

### 3. Active Review (Spaced Repetition)
To build long-term retention, run the CLI review session periodically:

```bash
athar review
```
This launches an interactive terminal session driven by the SuperMemo-2 (SM-2) algorithm. You will be prompted with questions generated during the passive collection phase. Self-assess your recall accuracy (0-5), and Athar will dynamically calculate the optimal next review interval.

---

## Command Line Interface (CLI)

Athar provides several commands for managing your engineering memory:

- `athar status`
  Displays a high-level statistical overview, including total lessons, pending reviews, and mastery distribution.

- `athar list [options]`
  Outputs a tabular view of your historical lessons. Supports filtering by tags, language, and status, as well as keyword searching.
  *Example*: `athar list --language typescript --tag async`

- `athar dashboard`
  Starts the local Nuxt 4 web interface.

---

## Visual Dashboard

For a comprehensive review of your historical data, Athar includes a bundled web dashboard.

Execute the following command:

```bash
athar dashboard
```

This spins up a local Nitro server bound to `http://127.0.0.1:3333`. The dashboard provides:
- **Analytics Grid**: Insights into your learning velocity and mastery metrics.
- **Lesson Repository**: A searchable, filterable index of all captured lessons.
- **Detailed Diff Views**: Side-by-side syntax-highlighted comparisons of bad vs. good code implementations.

---

## Data Privacy

Athar operates strictly via `node:sqlite`. All data is stored locally on your filesystem under the XDG data directory (`~/.local/share/athar/`). Zero telemetry is collected, and no data is transmitted to external servers.

## License

MIT
