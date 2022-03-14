import type { FlagsArray } from '../utils/flag-extractor.ts'

//* Assembles all config file functions in one
import { ConfigOptions } from "./config-types.d.ts";
import { getConfigsFromFile } from "./get-configs.ts"
import { getConfigFilePath } from "./get-path.ts"
import { configsCheck } from './config-check.ts'

interface ConfigFileMainOverload {
   (flags: FlagsArray): Promise<{ config?: ConfigOptions, err?: true, err_msg?: string }>
   (flags: FlagsArray): Promise<{ config?: ConfigOptions }>
}

//TODO Add config file caching inside a .dyarn folder per project

export const configFile: ConfigFileMainOverload = async (flags: FlagsArray) => {
   //* Looking for config file and it's commands
   const configPathGet = getConfigFilePath(flags)
   if(configPathGet.err) return {
      err: true,
      err_msg: configPathGet.err_msg,
      config: undefined
   }
   const configPath = configPathGet.configPath as string

   //* Checking if config file exists
   try {
      await Deno.stat(configPath)
   } catch (err) {
      console.error(`[ERROR] The provided/default config file path "${configPath}" was not found!`)
      Deno.exit(1)
   }
   if(!(await Deno.stat(configPath)).isFile) return {
      err: true,
      err_msg: `The used '${configPath}' isn't a file!`,
      config: undefined
   }

   //* Getting configs
   const configsFromFile = getConfigsFromFile(configPath)
   if(configsFromFile.err) return {
      err: true,
      err_msg: configsFromFile.err_msg,  
      config: undefined
   }

   //*Checking if configs are valid
   const checks = configsCheck(configsFromFile.config)
   if(!checks.success) return {
      err: true,
      err_msg: checks.err,
      config: undefined
   }

   //* Returning configs
   const config = configsFromFile.config as ConfigOptions
   return { config: config }
}


export { getScripts } from "./get-scripts.ts"