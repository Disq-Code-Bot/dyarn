import { ConfigOptions } from "./config-types.d.ts"

export const getScripts = (config: ConfigOptions): ConfigOptions['scripts']  => {
   const scripts = config.scripts as ConfigOptions['scripts']
   return scripts
}