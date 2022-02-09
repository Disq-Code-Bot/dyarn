export const dyarnConfigKey = "dyarnOptions"
export const defaultFile = "mod.ts"
export const defaultConfigFile = "deno.json"

export { flags } from './values/flags.ts'
export * from './values/gh-related.ts'

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

export const version = "1.1.0"
