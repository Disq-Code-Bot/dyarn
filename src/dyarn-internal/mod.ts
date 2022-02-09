import type { FlagsArray } from '../utils/flag-extractor.ts'
import { help } from './help/help-cmd.ts'

export interface Command {
   invoker: string,
   description?: string,
   flags?: CommandFlags
   run: (flag: FlagsArray) => Promise<{ success: true } | { success: false, err: string }>,
}

export interface  CommandFlags {
   required: boolean,
   arr: Array<{
      flag: string,
      required: boolean,
      description?: string,
      dependsOnFlag?: string[],
   }>
}

export const commandsNoHelp: Command[] = [
   {
      invoker: 'issues',
      description: 'Gives you the link to the issues page of the project',
      run: async () => {
         await console.log(`You may open an issues at: https://github.com/Disq-Code-Bot/dyarn/issues !`)
         return { success: true }
      }
   },
   {
      invoker: 'update',
      description: 'Updates Dyarn to the latest version or to a specific version',
      flags: {
         required: false,
         arr: [
            {
               flag: '-v',
               required: false,
               description: 'The version to update to',
            },
         ],
      },
      run: async () => { await console.log(''); return {success: true} }
   }
]

export const commands: Command[] = [
   {
      invoker: "help",
      description: "Prints this help message",
      run: () => help(),
   },
   ...commandsNoHelp
]