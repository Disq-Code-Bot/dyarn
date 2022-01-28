import { configFile, getScripts } from '../config-file/mod.ts'
import type { RunOptions } from '../../types/deno-types.d.ts'
import { defaultFile } from '../global-defs.ts'

interface InvokeCfgScriptsOverload {
   (script: string, args: string[]): { success: boolean, cmdData?: RunOptions, hasScripts?: boolean, err_msg?: string }
}

//* Get config file and check for config scripts
export const invokeCfgScripts: InvokeCfgScriptsOverload = 
   (script: string, args: string[]) => {
   //* Getting config 
   const configs = configFile(args)

   if(configs.err) return {
      success: false,
      err_msg: configs.err_msg as string
   }

   //* Getting scripts from config file
   const scripts = getScripts(configs.config!)
   
   if(!scripts.hasScripts) return { 
      success: false,
      hasScripts: false 
   }

   //* Checking if script exists
   if(!scripts.scripts[script]) return {
      success: false,
      err_msg: `Script "${script}" was not found in config file`
   }

   //* Getting script data
   const scriptData = scripts.scripts[script]

   //* Getting script runtime configs: file, flags, custom file, app flags 
   const runFile = `${Deno.cwd()}/${scriptData.customFile ?? configs.config?.mainFile ?? defaultFile}`
   const runFlags = scriptData.flags?.split(' ') ?? []
   const appFlags = scriptData.appFlags?.split(' ') ?? []
   const runApp = ['deno', scriptData.invoker]
   //TODO Add env vars
   
   //*Checking if run file is directory or even exists 
   if(!Deno.statSync(runFile).isDirectory) return {
      success: false,
      err_msg: `The invoked path "${runFile}" is a directory!`
   }

   if(!Deno.statSync(runFile).isFile) return {
      success: false,
      err_msg: `File "${runFile}" was not found!`
   }


   return {
      success: true,
      cmdData: {
         cmd: runApp.concat(runFlags, runFile, appFlags),
         //TODO add configurations to other Deno.run options
         stdout: 'piped',
         stderr: 'piped',
         stdin: 'inherit'
      },
      hasScripts: true,
   }

}