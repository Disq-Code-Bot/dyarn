import { dyarnConfigKey, defaultConfigFile } from './config-file.ts'
import type { ConfigOptions } from './config-file.ts'

const messages = {
   "noConfigFile" : "No config file found. Please create one and name it 'config.json' or define your own and pass it's path as --config-file=<file name> argument.",
   "noConfigKey" : "No dyarn config options was found on config file.",
   "noFilePath" : "No dyarn config options was found on config file.",
   "noScripts" : "No scripts exists in dyarn config options",
   "JSONParseError" : "Error parsing config file. Please check if it's valid JSON. JSON returned:",
}



//TODO add later custom options for maybe automated dep checks, lint, output file

export async function ConfigFileCheck(
   configFilePath: string = defaultConfigFile
   ): Promise<ConfigOptions> {
   //* Reading config file. Try and catch to handle if file doesn't exist
   let configFile
   let parsedConfigs

   try {
      configFile = await Deno.readTextFile(`${Deno.cwd()}/${configFilePath}`)
   } catch {
      throw new Error(`Error: '${configFilePath}' doesn't exist or is empty!`)
   }
   
   try {
      parsedConfigs = await JSON.parse(configFile)[dyarnConfigKey] as ConfigOptions
   } catch(error) {
      throw new Error(`${messages.JSONParseError} ${error}`)
   }
   
   //* Checking if config file has correct format options
   if(!parsedConfigs.mainFile) throw new Error(messages.noConfigKey)
   
   if(!parsedConfigs.scripts || typeof parsedConfigs.scripts !== 'object') 
      throw new Error(messages.noScripts)
   
   //* Checking if scripts have correct format options
   for(const scriptName in parsedConfigs.scripts) {
      if(!parsedConfigs.scripts[scriptName].invoker)
         throw new Error(messages.noScripts)
   }

   return parsedConfigs
}