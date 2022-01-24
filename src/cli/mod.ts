//* Iterates though all dyarn/deno/config file commands
//* and calls the respective invoker

import { configFile } from "../config-file/mod.ts"


//TODO Add update command and dyarn own commands
export function cli(args: string[]): 
   { success: true } | { success: false, err: string } 
   {
   //TODO Add dyarn default commands
   //TODO Add other commands to be checked before looking for config file

   //* Getting config file and it's commands
   const configs = configFile(args)

   //TODO Add config file processing

   return { success: true }
}