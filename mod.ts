import type { CLIInfo } from './types/cli.d.ts'

import { PermsCheck } from './src/perms/check.ts'
import { cli  } from './src/cli/mod.ts'
import { flagExtractor } from './src/utils/flag-extractor.ts'

import { 
   prefixLogError,
   bgLogError
} from './src/cli/logging.ts'

await (async function main() {
   //* Checking if there is any flag
   if(!Deno.args || Deno.args.length === 0) {
      bgLogError("You must provide at least one argument!", {
         verbose: true
      } as CLIInfo)
      Deno.exit(1)
   }
   
   //* Extracting flags and command
   const flags = flagExtractor(Deno.args)
   if(flags.err) {
      prefixLogError(`${flags.err}`, {
         verbose: true
      } as CLIInfo)
      Deno.exit(1)
   }
   
   //* Checking if user want's to see extended verbose info
   const verboseOn = flags.flags
      ?.find(flag => flag.flagName === 'verbose')?.flagValue as boolean ?? false

   const cliInfo: CLIInfo = {
      cmd: flags.cmd as string,
      flags: flags.flags,
      cwd: Deno.cwd(),
      currDate: new Date(),
      verbose: verboseOn
   }
   
   try {   


      //* Checking if script has right permissions to run
      const permissions = await PermsCheck(cliInfo)
      if(!permissions.success) {
         prefixLogError(`${permissions.err}`, cliInfo)
         Deno.exit(1)
      }

      //TODO Add OS check
      //TODO Add version check and update recommendation
      
      //* Actually running user's app
      const cliStatus = await cli(cliInfo)

      if(!cliStatus.success) {
         prefixLogError(`${cliStatus.err}`, cliInfo)
         Deno.exit(1)
      }
   
      //* Voila, finished!
      Deno.exit(0)
   } catch(error) {
      prefixLogError(`[UNEXPECTED]\n ${error}`, cliInfo)
      Deno.exit(1)
   }
})()