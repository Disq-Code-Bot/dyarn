export const dyarnConfigKey = "dyarnOptions"
export const defaultFile = "mod.ts"
export const defaultConfigFile = "deno.json"

type ScriptsType = {
   invoker: string, 
   denoFlags?: string, 
   customFile?: string
   appFlags?: string
}

export interface ConfigOptions {
   scripts: Record<string, ScriptsType>
   mainFile: typeof defaultFile
}