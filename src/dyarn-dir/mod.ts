import type { CLIInfo } from '../../types/cli.d.ts'

import {
   dyarnProjectDirPath
} from '../global-defs.ts'

export async function checkDyarnProjectDir(cliInfo: CLIInfo): Promise<{
   success: true
   err: undefined
} | {
   success: false,
   err: string
}> {
   const dyarnProjectUrl = `${cliInfo.cwd}/${dyarnProjectDirPath}`
   try {
      const dir = await Deno.stat(dyarnProjectUrl)

      if(!dir.isDirectory) return {
         success: false,
         err: `Weirdly .dyarn folder on ${dyarnProjectUrl} is not a directory...`
      }
      return {
         success: true,
         err: undefined
      }
   }
   catch {
      return {
         success: false,
         err: `There is no dyarn dir at ${dyarnProjectDirPath}`
      }
   }
}

export async function createDyarnProjectDir(cliInfo: CLIInfo): Promise<{
   success: true
   err: undefined
} | {
   success: false,
   err: string
}> {
   const dir = await Deno.mkdir(
      `${cliInfo.cwd}/${dyarnProjectDirPath}`, 
      { recursive: true }
   ).catch(err => 
      `Strange... something unexpected occurred when trying to create a .dyarn directory on your project's dir.\n [ERR MESSAGE]: ${err}`)

   if (typeof dir === 'string') return {
      success: false,
      err: dir
   }

   return {
      success: true,
      err: undefined
   }
}