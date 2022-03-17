import type { CLIInfo } from './../../../types/cli.d.ts'

import { commandsNoHelp } from '../mod.ts'

import {
   logNorm,
   fontFormat,
   colorString
} from '../../cli/logging.ts'

export const help = async (cliInfo: CLIInfo): Promise<{
   success: true
} | {
   success: false,
   err: string
}> => {
   const helpString = `
   Hello! This is Dyarn's help command! A runner helper for Deno, the friendly Dinossaur 🦖!
   You can use it to discover all the commands available, or to run a specific command.

   USAGE:
      dyarn [command] [flags]

   FULL HELP: ${commandsNoHelp.map(cmd => `
   - \`${
      colorString(false, {r: 143, g: 255, b: 249}, cmd.invoker, cliInfo)
   }\`
      ${cmd.description ? fontFormat(cmd.description, {italic: true}) : 'No description'}
      ${cmd.flags ? `Flags: ${cmd.flags.arr.map(flag => `
         - \`${flag.flag}\` - ${
            fontFormat(flag.required ? 'required' : 'optional', {dim: true})
            }
            ${flag.description ? `Description: ${
               fontFormat(flag.description, {italic: true})
            }` : ''}`)}` 
      : ''}`)}
   `

   await logNorm(helpString, cliInfo)
   return { success: true }
}
