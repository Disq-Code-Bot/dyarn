import type { CLIInfo } from '../../types/cli.d.ts'

import {
   dyarnProjectDirPath,
   configFileCacheFileName
} from '../global-defs.ts'

import {
   checkDyarnProjectDir,
   createDyarnProjectDir
} from '../dyarn-dir/mod.ts'

//* Assembles all config file functions in one
import { ConfigOptions } from "./config-types.d.ts";
import { getConfigsFromFile } from "./get-configs.ts"
import { getConfigFilePath } from "./get-path.ts"
import { configsCheck } from './config-check.ts'
import { cacheExists, getCache, createCache, invalidateCache } from './config-cache.ts'

interface ConfigFileMainOverload {
   (cliInfo: CLIInfo): Promise<{ config?: ConfigOptions, err?: true, err_msg?: string }>
   (cliInfo: CLIInfo): Promise<{ config?: ConfigOptions }>
}

export const configFile: ConfigFileMainOverload = async (cliInfo: CLIInfo) => {
   //* Looking for config file and it's commands
   const configPathGet = getConfigFilePath(cliInfo.flags)
   if(configPathGet.err) return {
      err: true,
      err_msg: configPathGet.err_msg,
      config: undefined
   }
   const configPath = configPathGet.configPath as string
   
   //* Checking for config cache
   //* Checking if dyarn project dir exists
   const checkDyarnDir = await checkDyarnProjectDir(cliInfo)

   const noCacheFlag = cliInfo.flags!.find(flag => (flag.flagName === 'no-cache' && flag.flagValue === true))
   if(checkDyarnDir.success && (!cliInfo.flags || !noCacheFlag)) {
      const cacheExistsResult = await cacheExists(configPath, cliInfo)
      
      if(!cacheExistsResult.success) {
         console.warn(`[WARN] Cache validity/existante check errored. Dyarn will keep running normally with config file, but this can cause small performance issues.\n [CACHE ERR]: ${cacheExistsResult.err}`)
      } 

      if(!!cacheExistsResult.hasCache && !!cacheExistsResult.isValid) {
         const getCacheResult = await getCache()
         console.info(`[INFO] Using cached config file.`)
         if(!getCacheResult.success) {
            console.warn(`[WARN] Cache retrieve errored. Dyarn will keep running normally with config file, but this can cause small performance issues.\n [CACHE ERR]: ${cacheExistsResult.err}`)
         } else return {
            config: getCacheResult.cache
         }
      }

      if(!cacheExistsResult.isValid && !!cacheExistsResult.hasCache) {
         const cachePath = `${Deno.cwd()}/${dyarnProjectDirPath}/${configFileCacheFileName}`

         const invalidateCacheResult = await invalidateCache(cachePath)

         if(!invalidateCacheResult.success) {
            console.warn(`[WARN] Cache invalidation errored. Dyarn will keep running normally with config file, but this can cause small performance issues.\n [CACHE ERR]: ${cacheExistsResult.err}`)
         }
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
   if((!cliInfo.flags || !noCacheFlag) && !configsFromFile.config?.noCache) {
      
      //* Checking if dyarn project dir exists or creating it
      if(!checkDyarnDir.success) {
         const createDyarnDirResult = await createDyarnProjectDir(cliInfo)
         if(!createDyarnDirResult.success) {
            console.warn(`[WARN] Dyarn project dir creation errored. Dyarn will keep running normally with config file, but this can cause small performance issues.\n [DIR ERR]: ${createDyarnDirResult.err}`)
         }
      }
      const configFileStat = await Deno.stat(configPath)
      const cache = await createCache(configsFromFile.config!, configFileStat, configPath, cliInfo)
      if(!cache.success) {
         console.warn(`[WARN] Cache creation errored. Dyarn will keep running normally with config file, but this can cause small performance issues.\n [CACHE ERR]: ${cache.err}`)
      }
   }

   //* Returning configs
   const config = configsFromFile.config as ConfigOptions
   return { config: config }
}


export { getScripts } from "./get-scripts.ts"