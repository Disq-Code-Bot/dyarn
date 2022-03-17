import type { CLIInfo } from './../../types/cli.d.ts'
import type { FlagsArray } from '../utils/flag-extractor.ts'

import { issuesUrl, dyarnProjectDirPath, configFileCacheFileName } from '../global-defs.ts'

//* Commands
import { help } from './help/help-cmd.ts'
import { getVersion } from './version.ts'
import { invalidateCache } from '../config-file/config-cache.ts'

import {
   logNorm,
   prefixLogSuccess
} from '../cli/logging.ts'

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
      run: async (_flags, cliInfo) => {
         await logNorm(`You may open an issues at: ${issuesUrl}!`, cliInfo, {
            italic: true,
         })
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
      run: async (_flags, cliInfo) => { 
         await logNorm('Sorry this is still unavailable', cliInfo, undefined, {
            r: 241,
            g: 255,
            b: 48,
         })
         return {success: true} 
      }
   },
   {
      invoker: 'version',
      description: `Prints Dyanr's current version`,
      flags: {
         required: false,
         arr: [
            {
               flag: '--all',
               required: false,
               description: 'Prints the list of all available versions',
            },
            {
               flag: '-a',
               required: false,
               description: 'Prints the list of all available versions',
            }
         ],
      },
      run: async (flags, cliInfo) => { 
         const versionRun = await getVersion(flags, cliInfo) 
         return versionRun 
      },
   },
   {
      invoker: 'clean',
      description: 'Invalidates the config file cache',
      run: async (_flags, cliInfo) => {
         logNorm(`Invalidating config file cache...`, cliInfo)
         const cachePath = `${cliInfo.cwd}/${dyarnProjectDirPath}/${configFileCacheFileName}`
         const invalidateCacheResult = await invalidateCache(cachePath)
         
         if(!invalidateCacheResult.success) return {
            success: false,
            err: `Error invalidating config file cache:\n ${invalidateCacheResult.err}`,
         }

         prefixLogSuccess(`Successfully invalidated config file cache!`, cliInfo)
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
      run: (_flags, cliInfo) => help(cliInfo),
   },
   ...commandsNoHelp
]