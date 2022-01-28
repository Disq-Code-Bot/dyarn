import { PermsCheck } from './src/perms/check.ts'
import { cli  } from './src/cli/mod.ts'

const args = Deno.args.splice(0, 1) ?? undefined 

await (async function main() {
   try {
      //* Checking if script has right permissions to run
      //TODO Improve permissions check
      await PermsCheck()

      //TODO Add OS check
      //TODO Add version check and update recommendation
      
      //* Actually running user's app
      const cliStatus = await cli(args)

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