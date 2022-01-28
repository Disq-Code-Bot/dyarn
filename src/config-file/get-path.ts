//* Getting config file path from command line args or default

import { defaultConfigFile } from '../global-defs.ts'

interface GetConfigFile {
   (args: string[]): { configPath?: string, err?: true, err_msg?: string }
   (args: string[]): { configPath?: string }
}

//TODO Add config file path memorization by project path

export const getConfigFilePath: GetConfigFile = (args: string[]) => {
   //* Checking if any args are even provided else simply returning default config file
   if(!args || !Array.isArray(args)) return { configPath: defaultConfigFile }

   //* Checking if any of the args are the custom config path one and if not
   //* returning default
   const checkCustomConfigPath = args.find(arg => RegExp(/^--config=/).test(arg))
   if(!checkCustomConfigPath) return { configPath: defaultConfigFile }
   
   //* Getting custom config path
   const customConfigPath = checkCustomConfigPath.replace(/^--config=/, '')
   
   //* Checking for empty config flag
   if(!customConfigPath) return { 
      configPath: undefined, 
      err: true, 
      err_msg: 'No config file path provided with config flag!' 
   }
   else return { configPath: customConfigPath }
}
