export const dyarnConfigKey = "dyarnOptions"
export const defaultFile = "mod.ts"

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