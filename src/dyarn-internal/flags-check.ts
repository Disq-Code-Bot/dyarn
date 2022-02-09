import type { CommandFlags } from '../dyarn-internal/mod.ts'

export function checkFlags(args: string[], flagsToCheck: CommandFlags): { success: boolean, err_msg?: string } {
   //* Getting flags and removing cli agrs characters
   const flags = args.filter(arg => arg.startsWith('--'))
      .map(arg => arg.replace('--', '').replace('=', ''))
   
   //* Checking if flags are required
   if(flagsToCheck.required && (!flags || flags.length < 1)) return {
      success: false,
      err_msg: `This command requires flags, use help command to discover more!`
   }

   const filteredMissingFlags: string[] = []
   flagsToCheck.arr.map(flagObj => {
      if(!flagObj.required && !flags.includes(flagObj.flag)) return
      if(!flags.includes(flagObj.flag)) return flagObj.flag

      if(flagObj.dependsOnFlag){
         const missingFlagDeps = flagObj.dependsOnFlag.filter(flag => !flags.includes(flag))
         if(missingFlagDeps) return missingFlagDeps
      }
      return
   }).filter(flag => !!flag).forEach(missingFlag => Array.isArray(missingFlag) ? 
      missingFlag.forEach(subMissingFlag => 
         !filteredMissingFlags.includes(subMissingFlag) && 
            filteredMissingFlags.push(subMissingFlag)) 
      : !filteredMissingFlags.includes(missingFlag!) && filteredMissingFlags.push(missingFlag!))

   if(!filteredMissingFlags || !filteredMissingFlags[0]) return {
      success: true
   } 
   else return {
      success: false,
      err_msg: `The following flag${
         filteredMissingFlags.length > 1 ? 's' : ''
      }: "${
         filteredMissingFlags.join('", "')
      }"; ${
         filteredMissingFlags.length > 1 ? 'are' : 'is'
      } missing for this command!`
   }
}