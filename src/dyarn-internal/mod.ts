import type { FlagsArray } from '../utils/flag-extractor.ts'

import { issuesUrl, dyarnProjectDirPath, configFileCacheFileName } from '../global-defs.ts'

//* Commands
import { help } from './help/help-cmd.ts'
import { getVersion } from './version.ts'
import { invalidateCache } from '../config-file/config-cache.ts'

export interface Command {
   invoker: string,
   description?: string,
   flags?: CommandFlags
   run: (flag: FlagsArray, cliInfo: CLIInfo) => Promise<{ success: true } | { success: false, err: string }>,
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
         await console.log(`You may open an issues at: ${issuesUrl}!`)
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
      run: async () => { await console.log('Unavailable'); return {success: true} }
   },
   {
      invoker: 'version',
      description: `Prints Dyanr's current version`,
      flags: {
         required: false,
         arr: [
            {
               flag: '--list',
               required: false,
               description: 'Prints the list of all available versions',
            },
            {
               flag: '-l',
               required: false,
               description: 'Prints the list of all available versions',
            }
         ],
      },
      run: async (flags) => { const versionRun = await getVersion(flags); return versionRun },
   },
   {
      invoker: 'invalidate-cfg-cache',
      description: 'Invalidates the config file cache',
      run: async () => {
         await console.log(`  Invalidating config file cache...`)
         const cachePath = `${Deno.cwd()}/${dyarnProjectDirPath}/${configFileCacheFileName}`
         const invalidateCacheResult = await invalidateCache(cachePath)
         
         if(!invalidateCacheResult.success) return {
            success: false,
            err: `Error invalidating config file cache:\n ${invalidateCacheResult.err}`,
         }

         console.log(`   Successfully invalidated config file cache!`)
         return {
            success: true,
         }
      }
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