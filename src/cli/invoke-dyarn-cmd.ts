import type { CommandFlags } from '../dyarn-internal/mod.ts'
import { commands } from '../dyarn-internal/mod.ts'

function checkFlags(args: string[], flagsToCheck: CommandFlags): { success: boolean, err_msg?: string } {
   const flags = args.filter(arg => arg.startsWith('--'))
      .map(arg => arg.replace('--', '').replace('=', ''))
   
   if(flagsToCheck.required && !flags) return {
      success: false,
      err_msg: `Any of the needed flags for this commands where provided!`
   }

   const missingFlags = flagsToCheck.arr.map(flagObj => {
      if(!flagObj.required) return false
      if(!flags.includes(flagObj.flag)) return flagObj.flag

      if(flagObj.dependsOnFlag){
         const missingFlagDeps = 
            flagObj.dependsOnFlag.every(depFlag => flags.includes(depFlag))
         if(!missingFlagDeps) return flagObj.dependsOnFlag
      }
      return false
   })

   if(!missingFlags) return {
      success: true
   } 
   else return {
      success: false,
      err_msg: `The following flags: ${missingFlags.join(', ')} are missing for this command!`
   }
}

export const invokeDenoCommands = async (script: string, args: string[]): Promise<{
   success: true
} | {
   success: false
   notFound?: true
}> => {
   const command = commands.find(cmd => cmd.invoker === script)

   if(!command) return {
      success: false,
      notFound: true
   }

   if(command._flags && typeof args !== 'undefined') {
      
   } else if (command.flags) {
      
   }
}