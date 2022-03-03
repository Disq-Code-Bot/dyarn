import type { CLIInfo } from './types/cli.d.ts'

import { PermsCheck } from './src/perms/check.ts'
import { cli  } from './src/cli/mod.ts'
import { flagExtractor } from './src/utils/flag-extractor.ts'


//TODO Add https://deno.land/std@0.97.0/fmt for better logging and colors :)

await (async function main() {
   //* Checking if there is any flag
   if(!Deno.args || Deno.args.length === 0) {
      console.error("[ERROR] You must provide at least one argument!")
      Deno.exit(1)
   }

   try {   
      //* Extracting flags and command
      const flags = flagExtractor(Deno.args)
      if(flags.err) {
         console.error(`[ERROR]: ${flags.err}`)
         Deno.exit(1)
      }

      const cliInfo: CLIInfo = {
         cmd: flags.cmd as string,
         flags: flags.flags,
         cwd: Deno.cwd(),
      }


      //* Checking if script has right permissions to run
      const permissions = await PermsCheck()
      if(!permissions.success) {
         console.error(`[ERROR]: ${permissions.err}`)
         Deno.exit(1)
      }

      //TODO Add OS check
      //TODO Add version check and update recommendation
      
      //* Actually running user's app
      const cliStatus = await cli(cliInfo)

      if(!cliStatus.success) {
         console.error(`[ERROR]: ${cliStatus.err}`)
         Deno.exit(1)
      }
   
      //* Voila, finished!
      Deno.exit(0)
   } catch(error) {
      console.log(`[UNEXPECTED ERROR]:\n ${error}`)
      Deno.exit(1)
   }
})()