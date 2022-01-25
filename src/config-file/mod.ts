//* Assembles all config file functions in one
import { ConfigOptions } from "./config-types.d.ts";
import { getConfigsFromFile } from "./get-configs.ts"
import { getConfigFilePath } from "./get.ts"
import { configsCheck } from './config-check.ts'

interface ConfigFileMainOverload {
   (args: string[]): { config?: ConfigOptions, err?: true, err_msg?: string }
   (args: string[]): { config?: ConfigOptions }
}

export const configFile: ConfigFileMainOverload = (args: string []) => {
   //* Looking for config file and it's commands
   const configPathGet = getConfigFilePath(args)
   if(configPathGet.err) return {
      err: true,
      err_msg: configPathGet.err_msg,
      config: undefined
   }
   const configPath = configPathGet.configPath as string

   //* Checking if config file exists
   if(!Deno.statSync(configPath).isFile) return {
      err: true,
      err_msg: `The used '${configPath}' doesn't exist!`,
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

//TODO Add scripts getter export