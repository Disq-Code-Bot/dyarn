//* Iterates though all dyarn/deno/config file commands
//* and calls the respective invoker

import type { FlagsArray } from '../utils/flag-extractor.ts'

import { invokeDyarnCommands } from './invoke-dyarn-cmd.ts'
import { invokeCfgScripts } from './invoke-cfg-scripts.ts'


//TODO Add update command and dyarn own commands
export async function cli(script: string, flags: FlagsArray): 
   Promise<{ success: true } | { success: false, err: string }>
   {
   //TODO Add extended verbose option that prints all errors, all warnings, file paths, env vars, etc.
   //TODO and maybe select which of them to print --verbose=all,err,warn,paths,env

   //* Dyarn own commands
   const dayrnInternal = await invokeDyarnCommands(script, flags)
   if(dayrnInternal.success) return {
      success: true
   }
   else if(!dayrnInternal.success && !dayrnInternal.notFound) return {
      success: false,
      err: dayrnInternal.err!
   }

   //*Checking for config file commands 
   const cfgCmd = await invokeCfgScripts(script, flags)
      
   if(!cfgCmd.success && cfgCmd.hasScripts === false) return {
      success: false,
      err: `Neither any Dyarn built in commands nor any config file scripts with name "${script}" were found!`
   }
   if(!cfgCmd.success) return {
      success: false,
      err: cfgCmd.err_msg!
   }

   //* In case of success, run the command
   //TODO See about using Google's zx
   const process = Deno.run(cfgCmd.cmdData!)
   
   const { success, code, signal } = await process.status()

   if(!success) return {
      success: false,
      err: `Command "${script}" failed with code ${code} and signal ${signal}!!`
   }

   return { success: true }
}