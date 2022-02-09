import type { FlagsArray } from '../utils/flag-extractor.ts'

//* Getting config file path from command line args or default

import { defaultConfigFile, flags as flagsConsts } from '../global-defs.ts'

interface GetConfigFile {
   (flags: FlagsArray): { configPath?: string, err?: true, err_msg?: string }
   (flags: FlagsArray): { configPath?: string }
}

//TODO Add config file path memorization by project path

export const getConfigFilePath: GetConfigFile = (flags: FlagsArray) => {
   //* Checking if any args are even provided else simply returning default config file
   if(!flags) return { configPath: defaultConfigFile }

   //* Checking if any of the args are the custom config path one and if not
   //* returning default
   const customConfigFileP = flags.reverse().find(flag => 
      flag.flagName === flagsConsts.configFileFlag || 
      flag.flagName === flagsConsts.configFileMiniFlag )
   if(!customConfigFileP) return { configPath: defaultConfigFile }

   //* Checking if is really a path string
   if(typeof customConfigFileP.flagValue !== 'string') return {
      configPath: undefined, 
      err: true, 
      err_msg: `No config file path has invalid value type: ${typeof customConfigFileP.flagValue}`
   }
   if(customConfigFileP.flagValue.match(/^\/*.+\.(yaml|json)$/)) return {
      configPath: customConfigFileP.flagValue
   }
   else return {
      configPath: undefined, 
      err: true, 
      err_msg: `Path ${customConfigFileP.flagValue} is not a valid path!`
   }
}
