import type { CLIInfo } from '../../types/cli.d.ts'
//* Checking if script has right permissions to run

import { neededPerms } from '../global-defs.ts'

import { 
   bgLogWarn,
} from '../cli/logging.ts'

export async function PermsCheck(cliInfo: CLIInfo): Promise<{
   success: true
   err: undefined
} | {
   success: false
   err: string
}> {
   const permsRes = await Promise.all(neededPerms.map(async perm => {
      const permQuery = await Deno.permissions.query({ name: perm as any })

      if(permQuery.state === "granted") return
      
      
      bgLogWarn(`It is highly recommended that you grant read permission to the runner at installation time!`, cliInfo)

      const permReq = await Deno.permissions.request({ name: perm as any })

      if(permReq.state === "granted") return
      else if(permReq.state === 'denied') return {
         err: `${permReq}`
      }
   }) as unknown as {err: string}[])

   const permResFilter = permsRes.filter(res => !!res)

   if(permResFilter.length > 0) return {
      success: false,
      err: `Some permissions where not granted, and Dyarn need them: \n\n Please grant it: ${permResFilter.map(val => val!.err).join(", ")} permission${permResFilter.length > 1 ? 's' : ''}!`
   }

   return {
      success: true,
      err: undefined
   }
}