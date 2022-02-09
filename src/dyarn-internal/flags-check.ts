import type { FlagsArray } from '../utils/flag-extractor.ts'
import type { CommandFlags } from '../dyarn-internal/mod.ts'

export function checkFlags(flags: FlagsArray, flagsToCheck: CommandFlags): { success: boolean, err_msg?: string } {
   //* Checking if flags are required
   if(flagsToCheck.required && (!flags || flags.length < 1)) return {
      success: false,
      err_msg: `This command requires flags, use help command to discover more!`
   }

   const filteredMissingFlags: string[] = []
   flagsToCheck.arr.map(flagObj => {
      //* Saving in a boolean if flag is even defined
      const hasFlag = flags && flags.some(val => val.flagName === flagObj.flag)

      if(!flagObj.required && !hasFlag) return
      if(!hasFlag) return flagObj.flag

      if(flagObj.dependsOnFlag){
         const missingFlagDeps = flagObj.dependsOnFlag.filter(flag => {
            const hasSubFlag = flags && flags.some(val => val.flagName === flag)
            if(!hasSubFlag) return flag
         })
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