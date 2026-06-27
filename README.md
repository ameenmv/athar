# أثر — Athar

> **Every mistake leaves a trace, every lesson leaves an impact.**

An open-source, local-first MCP server that captures programming lessons from AI-assisted coding sessions, stores them in a local SQLite database, and uses spaced repetition to ensure you never repeat the same mistake twice.

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-≥20-339933?logo=node.js&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Protocol-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)
![SQLite](https://img.shields.io/badge/SQLite-Local--First-003B57?logo=sqlite&logoColor=white)

</div>

---

## 🧠 What is Athar?

**Athar** (أثر) is a memory system for developers. It works as an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that integrates with AI-powered IDEs like [Antigravity IDE](https://antigravity.google).

When you're coding with an AI assistant and it helps you fix a real bug, Athar automatically captures the lesson — the problem, root cause, fix, and review questions — and stores it locally. Later, it uses **spaced repetition** (SM-2 algorithm) to quiz you on past mistakes so they stick in your memory permanently.

### How it works

```
┌─────────────────────┐     stdio      ┌──────────────────┐
│   Antigravity IDE   │ ◄────────────► │   Athar MCP      │
│   (AI Assistant)    │   JSON-RPC     │   Server         │
└─────────────────────┘                └────────┬─────────┘
                                                │
                                       ┌────────▼─────────┐
                                       │   SQLite DB      │
                                       │   (local-first)  │
                                       │   ~/.local/share/ │
                                       │   athar/lessons.db│
                                       └──────────────────┘
                                                │
                                       ┌────────▼─────────┐
                                       │   CLI & Dashboard │
                                       │   athar review    │
                                       │   athar status    │
                                       └──────────────────┘
```

---

## ✨ Features

- **🔌 MCP Integration** — Works seamlessly with Antigravity IDE via stdio transport
- **📝 Smart Lesson Capture** — AI assistant saves lessons with structured data: problem, root cause, bad/good code, review questions
- **🛡️ Quality Validation** — Rejects trivial changes (formatting, typos) and detects duplicates
- **🔍 Full-Text Search** — FTS5-powered search to recall past lessons instantly
- **🧠 Spaced Repetition** — SM-2 algorithm schedules reviews at optimal intervals
- **💾 Local-First** — All data stored locally in SQLite. No cloud, no API keys, no costs
- **🌐 Bilingual** — Supports lessons in both Arabic and English
- **⚡ Zero Native Dependencies** — Uses Node.js built-in `node:sqlite` module

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20 (tested on v24)
- **Antigravity IDE** (or any MCP-compatible IDE)

### Installation

```bash
# Clone the repository
git clone https://github.com/ameenmv/athar.git
cd athar

# Install dependencies
npm install

# Build
npm run build
```

### Setup with Antigravity IDE

Run the setup command (coming in Phase 2), or manually add to your MCP config:

**`~/.gemini/config/mcp_config.json`**

```json
{
  "mcpServers": {
    "athar": {
      "command": "node",
      "args": ["/absolute/path/to/athar/dist/index.js"]
    }
  }
}
```

Then restart/refresh MCP servers in Antigravity IDE.

---

## 🛠️ MCP Tools

Athar exposes two tools to the AI assistant:

### `save_lesson`

Captures a programming lesson from a real mistake.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Concise title describing the mistake pattern |
| `problem` | string | ✅ | What went wrong — the symptom observed |
| `root_cause` | string | ✅ | WHY it happened — the actual root cause |
| `lesson` | string | ✅ | Key takeaway — what to remember |
| `tags` | string[] | ✅ | Categorization tags |
| `review_questions` | {q,a}[] | ✅ | 1-3 review questions for spaced repetition |
| `error_message` | string | ❌ | Exact error message or stack trace |
| `bad_code` | string | ❌ | The incorrect code snippet |
| `good_code` | string | ❌ | The corrected code snippet |
| `language` | string | ❌ | Programming language |
| `file_path` | string | ❌ | File where the error occurred |
| `git_diff` | string | ❌ | Git diff context |

**Validation rules:**
- Rejects trivial formatting/style changes
- Rejects if problem and root_cause are identical
- Requires both bad_code and good_code if either is provided
- Detects and rejects duplicates via FTS5 similarity

### `memory`

Searches past lessons for relevant mistakes and solutions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | ✅ | Search query — keyword, error pattern, or tag |
| `limit` | number | ❌ | Max results (1-10, default: 3) |
| `language` | string | ❌ | Filter by programming language |
| `tags` | string[] | ❌ | Filter by tags |

---

## 📁 Project Structure

```
athar/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── server.ts             # McpServer setup & tool registration
│   ├── db/
│   │   ├── schema.ts         # SQLite schema + FTS5 + triggers
│   │   └── connection.ts     # Database singleton
│   ├── tools/
│   │   ├── save-lesson.ts    # save_lesson handler + validation
│   │   ├── memory.ts         # memory search handler
│   │   └── validators.ts     # Zod schemas
│   ├── spaced-repetition/    # SM-2 algorithm (Phase 3)
│   ├── cli/                  # CLI commands (Phase 3)
│   └── utils/
│       ├── paths.ts          # XDG-compliant paths
│       └── logger.ts         # stderr-only logger
├── dashboard/                # Nuxt 4 web UI (Phase 4)
├── package.json
└── tsconfig.json
```

---

## 🗺️ Roadmap

- [x] **Phase 1** — Core MCP Server & Database
  - [x] SQLite schema with FTS5 full-text search
  - [x] `save_lesson` tool with quality validation
  - [x] `memory` search tool with FTS5 + LIKE fallback
  - [x] Duplicate detection
  - [x] stderr-only logging (MCP-safe)

- [ ] **Phase 2** — IDE Integration
  - [ ] `athar setup` command for Antigravity IDE
  - [ ] Auto-detect and configure MCP settings

- [ ] **Phase 3** — Spaced Repetition & CLI
  - [ ] SM-2 algorithm implementation
  - [ ] `athar review` — interactive terminal review sessions
  - [ ] `athar status` — pending reviews dashboard
  - [ ] `athar list` — browse and filter lessons

- [ ] **Phase 4** — Nuxt 4 Dashboard
  - [ ] Web UI for browsing lessons
  - [ ] Syntax-highlighted code diff viewer
  - [ ] Review progress visualization

---

## 🧪 Development

```bash
# Type check
npm run typecheck

# Build
npm run build

# Run MCP server directly (for testing)
npm run dev

# Run smoke tests
npx tsx src/smoke-test.ts
```

### Debug logging

Set `ATHAR_DEBUG=1` to enable verbose logging to stderr:

```bash
ATHAR_DEBUG=1 npm run dev
```

---

## 💡 How the AI Decides to Save a Lesson

The MCP server includes detailed instructions for the AI assistant. It will save a lesson when:

- ✅ Helping fix a **non-trivial bug** with a clear root cause
- ✅ Correcting a **misconception** about an API or framework
- ✅ A **debugging session** reveals unexpected behavior
- ✅ An **architectural mistake** is identified
- ✅ A **security vulnerability** or performance issue is discovered

It will **NOT** save for:
- ❌ Simple typos or formatting fixes
- ❌ Routine code generation
- ❌ Style preferences

---

## 📄 License

[MIT](LICENSE) — Built with ❤️ by [Ameen](https://github.com/ameenmv)
