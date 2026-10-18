import { runCli } from './cli.js';

const args = process.argv.slice(2);
const result = await runCli(args);
process.exit(result.exitCode);