#!/usr/bin/env node

/**
 * Athar (أثر) — MCP Server Entry Point
 * 
 * This is the main entry point for the MCP server.
 * It initializes the server and connects via stdio transport.
 * 
 * Usage in Antigravity IDE mcp_config.json:
 * {
 *   "mcpServers": {
 *     "athar": {
 *       "command": "node",
 *       "args": ["path/to/dist/index.js"]
 *     }
 *   }
 * }
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAtharServer } from './server.js';
import { closeDatabase } from './db/connection.js';
import { createLogger } from './utils/logger.js';

const log = createLogger('main');

async function main(): Promise<void> {
  log.info('Starting Athar MCP server v0.1.0...');

  const server = createAtharServer();
  const transport = new StdioServerTransport();

  // Graceful shutdown
  const shutdown = (): void => {
    log.info('Shutting down...');
    closeDatabase();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('uncaughtException', (err) => {
    log.error('Uncaught exception:', String(err));
    closeDatabase();
    process.exit(1);
  });

  await server.connect(transport);
  log.info('Athar MCP server connected and ready.');
}

main().catch((err) => {
  log.error('Fatal error:', String(err));
  closeDatabase();
  process.exit(1);
});
