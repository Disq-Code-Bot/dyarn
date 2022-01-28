import { ConfigOptions } from "./config-types.d.ts"

export const getScripts = (
   config: ConfigOptions
   ): { scripts: ConfigOptions['scripts'], hasScripts?: true } | { hasScripts: false }  => {
   if(!config.scripts) return {
      hasScripts: false
   }

   const scripts = config.scripts as ConfigOptions['scripts']
   return { scripts, hasScripts: true }
}