import type { CLIInfo } from '../../types/cli.d.ts'
import type { ConfigOptions, ConfigFileCacheType } from './config-types.d.ts'
import {
   checkDyarnProjectDir,
   createDyarnProjectDir
} from '../dyarn-dir/mod.ts'

import {
   dyarnProjectDirPath,
   configFileCacheFileName
} from '../global-defs.ts'

export async function cacheExists(configFilePath: string, cliInfo: CLIInfo): Promise<{
   success: true
   hasCache: boolean
   isValid: boolean
   err: undefined
} | {
   success: false
   hasCache: undefined
   isValid: undefined
   err: string
}> {
   //* Checking if dyarn project dir exists
   const checkDyarnDir = await checkDyarnProjectDir(cliInfo)

   if(!checkDyarnDir.success) return {
      success: true,
      hasCache: false,
      isValid: false,
      err: undefined
   }
   //* Checking if cache file exists
   const cacheFilePath = `${cliInfo.cwd}/${dyarnProjectDirPath}/${configFileCacheFileName}`

   try {
      const file = await Deno.stat(cacheFilePath)

      if(!file.isFile) return {
         success: false,
         hasCache: undefined,
         isValid: undefined,
         err: `Weirdly cache file on ${cacheFilePath} is not a file...`
      }

      //* Checking if cache file is valid
      
      //* Getting the cache file content
      const cacheFile = await Deno.readFile(cacheFilePath)
      const cacheFileJSON = JSON.parse(new TextDecoder().decode(cacheFile)) as ConfigFileCacheType

      //* Checking if cache file is valid comparing to the original config file mod date
      try {
         const originalConfigFile = await Deno.stat(configFilePath)
         if(!originalConfigFile.mtime) return {
            success: false,
            hasCache: undefined,
            isValid: undefined,
            err: `Weirdly original config file on ${configFilePath} does not have a mtime... Could not check cache validity.`
         }

         //* Finally checking if cache file is valid
         if(originalConfigFile.mtime?.toISOString() !== cacheFileJSON.configFileModDate) return {
            success: true,
            hasCache: true,
            isValid: false,
            err: undefined
         }

         //* Cache file is valid
         return {
            success: true,
            hasCache: true,
            isValid: true,
            err: undefined
         }
      } catch {
         //* Cache file is not valid anymore as the original config file does not exist anymore

         //* Invalidating cache file
         const cacheInvalidate = await invalidateCache(cacheFilePath)

         //* In case of error invalidating cache file
         if(!cacheInvalidate.success) return {
            success: false,
            hasCache: undefined,
            isValid: undefined,
            err: `Cache file is invalid and could not be invalidated/removed.\n [ERR MESSAGE]: ${cacheInvalidate.err}`
         } 

         return {
            success: true,
            hasCache: true,
            isValid: false,
            err: undefined
         }
      }
   }
   catch {
      return {
         success: true,
         hasCache: false,
         isValid: false,
         err: undefined
      }
   }
}

export async function createCache(config: ConfigOptions, configFileStat: Deno.FileInfo, configFilePath: ConfigFileCacheType['configFilePath'], cliInfo: CLIInfo): Promise<{
   success: true,
   err: undefined
} | {
   success: false,
   err: string
}> {
   //* Checking if dyarn project dir exists
   const checkDyarnDir = await checkDyarnProjectDir(cliInfo)
   
   //* If it doesn't exist, create it
   if(!checkDyarnDir.success) {
      const dirCreate = await createDyarnProjectDir(cliInfo)

      if(!dirCreate.success) return {
         success: false,
         err: dirCreate.err
      }
   }

   //* Creating config cache file
   const filePath = `${cliInfo.cwd}/${dyarnProjectDirPath}/${configFileCacheFileName}`
   const file = await Deno.create(filePath)

   //* Getting config file info to properly check cache validity later in case it is changed
   if(!configFileStat.mtime) return {
      success: false,
      err: `Couldn't get last modification time of config file which is required to cache it!`
   }

   const writeFileContent: ConfigFileCacheType = {
      cache: config,
      configFileModDate: configFileStat.mtime?.toISOString(),
      configFilePath: configFilePath,
      cacheDate: new Date().toISOString(),
      cacheFilePath: filePath.toString(),
   }

   const fileWrite = await file.write(new TextEncoder().encode(JSON.stringify(writeFileContent)))

   if(!fileWrite) return {
      success: false,
      err: `Couldn't write to config cache file!`
   }

   return {
      success: true,
      err: undefined
   }
}

export async function getCache(): Promise<{
   success: true
   cache: ConfigOptions
   err: undefined
} | {
   success: false
   cache: undefined
   err: string
}> {
   const cacheFilePath = `${Deno.cwd()}/${dyarnProjectDirPath}/${configFileCacheFileName}`

   try {
      const file = await Deno.readFileSync(cacheFilePath)

      const cacheFileJSON = JSON.parse(new TextDecoder().decode(file)) as ConfigFileCacheType
      return {
         success: true,
         cache: cacheFileJSON.cache,
         err: undefined
      }
   } catch(err) {
      return {
         success: false,
         cache: undefined,
         err: `Couldn't get cache file!\n [ERR MESSAGE]: ${err}`
      }
   }
}

export async function invalidateCache(cacheFilePath: string | URL): Promise<{
   success: true,
   err: undefined
} | {
   success: false,
   err: string
}> {
   try {
      await Deno.remove(cacheFilePath)
      return {
         success: true,
         err: undefined
      }
   } catch(err) {
      return {
         success: false,
         err: `Error removing cache file.\n [ERR MESSAGE]: ${err}`
      }
   }
} 