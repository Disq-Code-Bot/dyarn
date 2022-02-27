import type { FlagsArray } from '../utils/flag-extractor.ts'
import {
   dyarnProjectDirPath,
   configFileCacheFileName
} from '../global-defs.ts'

//* Assembles all config file functions in one
import { ConfigOptions } from "./config-types.d.ts";
import { getConfigsFromFile } from "./get-configs.ts"
import { getConfigFilePath } from "./get-path.ts"
import { configsCheck } from './config-check.ts'
import { cacheExists, getCache, createCache, invalidateCache } from './config-cache.ts'

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
   
   //* Checking for config cache
   const cacheExistsResult = await cacheExists(configPath)
   
   if(!cacheExistsResult.success) {
      console.warn(`[WARN] Cache validity/existante check errored. Dyarn will keep running normally with config file, but this can cause small performance issues.\n [CACHE ERR]: ${cacheExistsResult.err}`)
   } 
   
   if(!!cacheExistsResult.hasCache && !!cacheExistsResult.isValid) {
      const getCacheResult = await getCache()
      console.log(`[INFO] Using cached config file.`)
      if(!getCacheResult.success) {
         console.warn(`[WARN] Cache retrieve errored. Dyarn will keep running normally with config file, but this can cause small performance issues.\n [CACHE ERR]: ${cacheExistsResult.err}`)
      } else return {
         config: getCacheResult.cache
      }
   }

   if(!cacheExistsResult.isValid) {
      const cachePath = `${Deno.cwd()}/${dyarnProjectDirPath}/${configFileCacheFileName}`

      const invalidateCacheResult = await invalidateCache(cachePath)

      if(!invalidateCacheResult.success) {
         console.warn(`[WARN] Cache invalidation errored. Dyarn will keep running normally with config file, but this can cause small performance issues.\n [CACHE ERR]: ${cacheExistsResult.err}`)
      }
   }

   //* Checking if config file exists
   try {
      await Deno.stat(configPath)
   } catch {
      return {
         err: true,
         err_msg: `The provided/default config file path '${configPath}' was not found!`
      }
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

   //* Saving cache
   const configFileStat = await Deno.stat(configPath)
   const cache = await createCache(configsFromFile.config!, configFileStat, configPath)
   if(!cache.success) {
      console.warn(`[WARN] Cache creation errored. Dyarn will keep running normally with config file, but this can cause small performance issues.\n [CACHE ERR]: ${cache.err}`)
   }

   //* Returning configs
   const config = configsFromFile.config as ConfigOptions
   return { config: config }
}


export { getScripts } from "./get-scripts.ts"