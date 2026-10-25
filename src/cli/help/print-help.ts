// Print help function
import { generateGlobalHelp, generateCommandHelp } from './templates.js';
import { subcommands } from '../args/subcommands.js';

export function printHelp(commandName?: string): void {
  if (commandName && subcommands.some(c => c.name === commandName)) {
    console.log(generateCommandHelp(commandName));
  } else {
    console.log(generateGlobalHelp());
  }
}