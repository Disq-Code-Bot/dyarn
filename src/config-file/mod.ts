//* Assembles all config file functions in one
import { ConfigOptions } from "./config-types.d.ts";
import { checkExists } from "./file-checks.ts"
import { getConfigFilePath } from "./get.ts"

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
   if(!checkExists(configPath)) return {
      err: true,
      err_msg: configPathGet.err_msg,
      config: `The used '${configPath}' doesn't exist!`
   }

   //TODO Get actual config file
}