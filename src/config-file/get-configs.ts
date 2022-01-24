import { dyarnConfigKey } from './../global-defs.ts';
import type { ConfigOptions } from './config-types.d.ts'


interface GetConfigFromFileOverload {
   (configPath: string): { config?: ConfigOptions, err?: true, err_msg?: string }
   (configPath: string): { config?: ConfigOptions}
}

export const getConfigsFromFile: GetConfigFromFileOverload = (configPath: string) => {
   const configFileRead = Deno.readTextFileSync(configPath)

   if(!configFileRead) return {
      config: undefined,
      err: true,
      err_msg: `Provided or default: '${configPath}', doesn't exist or is empty/has no config!`
   }      

   let configFile
   try{
      configFile = JSON.parse(configFileRead)
   } catch(err) {
      return {
         config: undefined,
         err: true,
         err_msg: `Error parsing config file. Please check if it's valid JSON. JSON error eturned: ${err}`
      }
   }

   if(!configFile[dyarnConfigKey]) return {
      config: undefined,
      err: true,
      err_msg: `No dayrn config was provided in the used ${configPath} file! Be sure to also write configs under the ${dyarnConfigKey} key.`
   }

   return {
      config: configFile[dyarnConfigKey]
   }
}