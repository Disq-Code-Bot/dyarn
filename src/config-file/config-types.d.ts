export interface ScriptsType {
   invoker: string,
   flags?: string,
   customFile?: string
   appFlags?: string
   env?: Record<any, any>
}

export interface ConfigOptions {
   mainFile?: string
   scripts: Record<string, ScriptsType>
}

export interface ConfigFileCacheType {
   cache: ConfigOptions
   configFileModDate: string
   cacheDate: string
   configFilePath: string
   cacheFilePath: string
}