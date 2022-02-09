import type { FlagsArray } from '../utils/flag-extractor.ts'

import { flags as flagsConsts, ghAPIUrl, allVersionsUrl, version } from '../global-defs.ts'

//* Lists current version or all versions

export async function getVersion(flags: FlagsArray): Promise<{ 
   success: true 
} | { 
   success: false, 
   err: string 
}> {
   console.log(`\n Your current version of Dyarn is: ${version}`)

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
         console.log(`\n And the following versions are available: \n - Most recent -> ${versions[0].name} \n\n - Older versions: \n\n    ${versions.slice(1).map(ver => ver.name).join(', ')}`)
      } else return {
         success: false,
         err: `Could not fetch versions from GitHub!`
      }
   } 
   return {
      success: true
   }
}