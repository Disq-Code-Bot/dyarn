import specs from './specs.json' assert {type: 'json'}
import messages from './messages.json' assert {type: 'json'}

export type ConfigOptions = {
   scripts: Object
   mainFile: typeof specs.defaultFile
}
//TODO add later custom options for maybe automated dep checks, lint, output file

export async function ConfigFileCheck(
   configFilePath: string = specs.defaultConfigFile
   ): Promise<ConfigOptions> {
   //* Reading config file. Try and catch to handle if file doesn't exist
   let parsedConfigs
   try {
      const configFile = await Deno.readTextFile(configFilePath)
      parsedConfigs = JSON.parse(configFile)[specs.configKey] as ConfigOptions
   } catch {
      throw new Error(`Error: '${configFilePath}' doesn't exist!`)
   }

   //* Checking if config file has correct format options
   if(!parsedConfigs.mainFile) throw new Error(messages.ConfigFileCheck.noConfigKey)

   if(!parsedConfigs.scripts || typeof parsedConfigs.scripts !== 'object') 
      throw new Error(messages.ConfigFileCheck.noScripts)

   return parsedConfigs
}