import { PermsCheck } from './src/perms/check.ts'
import { cli  } from './src/cli/mod.ts'


//TODO Add https://deno.land/std@0.97.0/fmt for better logging and colors :)

await (async function main() {
   if(!Deno.args || Deno.args.length === 0) {
      console.error("[ERROR] You must provide at least one argument!")
      Deno.exit(1)
   }
   
   const args = Array.from(Deno.args).splice(1)
   const script = Deno.args[0]
   try {   

      //* Checking if script has right permissions to run
      //TODO Improve permissions check
      await PermsCheck()

      //TODO Add OS check
      //TODO Add version check and update recommendation
      //TODO add flags to object[] to make it easier to check/use flags
      
      //* Actually running user's app
      const cliStatus = await cli(script, args)

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