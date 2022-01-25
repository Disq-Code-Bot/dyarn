import { RecursiveTypeCheck } from './../utils/config-mach.ts'
import { configType } from '../global-defs.ts'

interface ConfigCheckOverload {
   (config: any): { success: true } | { success: false, err: string }
}

export const configsCheck: ConfigCheckOverload = (config) => {  
   //*Calling recursive function config check
   const checkResults = RecursiveTypeCheck(config, configType)

   if(!checkResults.checks) return {
      success: false,
      err: checkResults.err
   }

   return { success: true }
}