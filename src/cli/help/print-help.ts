// Print help function
import { generateGlobalHelp, generateCommandHelp } from './templates.js';
import { subcommands } from '../args/subcommands.js';

export function printHelp(commandName?: string, stream: NodeJS.WritableStream = process.stdout): void {
  const text = commandName && subcommands.some(c => c.name === commandName)
    ? generateCommandHelp(commandName)
    : generateGlobalHelp();

  stream.write(text.endsWith('\n') ? text : text + '\n');
}
