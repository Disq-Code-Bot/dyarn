export interface ScriptsType {
   invoker: string,
   flags?: string,
   customFile?: string
   appFlags?: string
}

export interface ConfigOptions {
   mainFile: string
   scripts: Record<string, ScriptsType>
}