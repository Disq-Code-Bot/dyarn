const dyarnConfigKey = "dyarnOptions"
const defaultFile = "mod.ts"

const messages = {
   "noConfigFile" : "No config file found. Please create one and name it 'config.json' or define your own and pass it's path as --config-file=<file name> argument.",
   "noConfigKey" : "No dyarn config options was found on config file.",
   "noFilePath" : "No dyarn config options was found on config file.",
   "noScripts" : "No scripts exists in dyarn config options"
}

export const defaultConfigFile = "config.json"

export type ConfigOptions = {
   scripts: Record<string, {invoker: string, denoFlags?: string}>
   mainFile: typeof defaultFile
}
//TODO add later custom options for maybe automated dep checks, lint, output file

export async function ConfigFileCheck(
   configFilePath: string = defaultFile
   ): Promise<ConfigOptions> {
   //* Reading config file. Try and catch to handle if file doesn't exist
   let parsedConfigs
   try {
      const configFile = await Deno.readTextFile(`${Deno.cwd()}/${configFilePath}`)
      parsedConfigs = JSON.parse(configFile)[dyarnConfigKey] as ConfigOptions
   } catch {
      throw new Error(`Error: '${configFilePath}' doesn't exist or is empty!`)
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