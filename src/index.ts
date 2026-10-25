#!/usr/bin/env node
// Binary entry point
import { runCli } from './cli/run-cli.js';

const args = process.argv.slice(2);
const result = await runCli(args);
process.exit(result.exitCode);