import type { CLIInfo } from './../../types/cli.d.ts'
import type { FlagsArray } from '../utils/flag-extractor.ts'

import { flags as flagsConsts, ghAPIUrl, allVersionsUrl, version } from '../global-defs.ts'

import {
   logNorm,
} from '../cli/logging.ts'

//* Lists current version or all versions

export async function getVersion(flags: FlagsArray, cliInfo: CLIInfo): Promise<{ 
   success: true 
} | { 
   success: false, 
   err: string 
}> {
   logNorm(`\n Your current version of Dyarn is: `, cliInfo)
   logNorm(version, cliInfo, {
      italic: true,
   },{
      r: 143,
      g: 255,
      b: 249,
   })

   const flag = flagsConsts.versionCmd.listAll
   const miniFlag = flagsConsts.versionCmd.listAllMini
   //* Get all versions from github api
   if (!!flags && 
      flags.find(val => val.flagName === flag || val.flagName === miniFlag)?.flagValue) {
      let versionsFetch
      try {
         versionsFetch = await fetch(`${ghAPIUrl}${allVersionsUrl}`)
      } catch(err) {
         return {
            success: false,
            err: `Error fetching Dyarn versions: \n${err}`
         }
      }
      if(versionsFetch.status === 200) {
         const versions = await versionsFetch.json() as { name: string }[]
         logNorm(`\n Available versions of Dyarn: \n`, cliInfo)
         versions.forEach((version, i) => {
            logNorm(' - ', cliInfo) 
            logNorm(`${version.name}${i === 0 ? ' - (Most recent)' : ''}\n`, cliInfo, {
               italic: true,
            }, i === 0 ? {
               r: 143,
               g: 255,
               b: 249,
            } : undefined)
         })
      } else return {
         success: false,
         err: `Could not fetch versions from GitHub!`
      }
   } 
   return {
      success: true
   }
}