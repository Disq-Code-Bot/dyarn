import { commandsNoHelp } from '../mod.ts'

export const help = async (): Promise<{
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
   - Command: '${cmd.invoker}'
      Description: ${cmd.description}
      ${cmd.flags ? `Flags: ${cmd.flags.arr.map(flag => `
         - '${flag.flag}' - ${flag.required ? 'required' : 'optional'}
            ${flag.description ? `Description: ${flag.description}` : ''}`)}` 
      : ''}`)}
   `

   await console.log(helpString)
   return { success: true }
}
