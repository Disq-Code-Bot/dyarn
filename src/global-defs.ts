export const dyarnConfigKey = "dyarnOptions"
export const defaultFile = "mod.ts"
export const defaultConfigFile = "deno.json"

export { flags } from './values/flags.ts'
export * from './values/gh-related.ts'
export * from './values/dyarn-dir/cache.ts'
export * from './values/dyarn-dir/mod.ts'

export const configType = {
   "_mainFile": "string",
   "_{}scripts": { 
      "invoker": "string",
      "_flags": "string",
      "_file": "string",
      "_appFlags": "string",
      "_{}env": "?",
   }
}

export const version = "1.0.5-dev"