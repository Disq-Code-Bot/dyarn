//* Iterates though all dyarn/deno/config file commands
//* and calls the respective invoker
import type { RunOptions } from '../../types/deno-types.d.ts'

import { invokeCfgScripts } from './invoke-cfg-scripts.ts'


//TODO Add update command and dyarn own commands
export async function cli(script: string, args: string[]): 
   Promise<{ success: true } | { success: false, err: string }>
   {
   let cmdOptions: RunOptions
   //TODO Add dyarn default commands
   //TODO Add other commands to be checked before looking for config file

   //*Checking for config file commands 
   //TODO Uncomment this after adding Dyarn built in commands
   //if(!cmdOptions) {
      const cfgCmd = await invokeCfgScripts(script, args.slice(1))
      
      if(!cfgCmd.success && cfgCmd.hasScripts === false) return {
         success: false,
         err: `Neither any Dyarn built in commands nor any config file scripts with name "${args[0]}" were found!`
      }

      if(!cfgCmd.success) return {
         success: false,
         err: cfgCmd.err_msg!
      }

      cmdOptions = cfgCmd.cmdData!
   //}

   //* In case of success, run the command
   const process = Deno.run(cmdOptions)
   
   const { success, code, signal } = await process.status()

   if(!success) return {
      success: false,
      err: `Command "${args[0]}" failed with code ${code} and signal ${signal}!!`
   }

   return { success: true }
}