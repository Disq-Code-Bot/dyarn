import type { RunOptions } from '../../types/deno-types.d.ts'
import type { CLIInfo } from '../../types/cli.d.ts'
import { configFile, getScripts } from '../config-file/mod.ts'
import { defaultFile } from '../global-defs.ts'

interface InvokeCfgScriptsOverload {
   (cliInfo: CLIInfo): Promise<{ success: boolean, cmdData?: RunOptions, hasScripts?: boolean, err_msg?: string }>
}

//* Get config file and check for config scripts
export const invokeCfgScripts: InvokeCfgScriptsOverload = 
   async (cliInfo: CLIInfo) => {
   //* Getting config 
   const configs = await configFile(cliInfo)

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
   if(!scripts.scripts[cliInfo.cmd!]) return {
      success: false,
      err_msg: `Script "${cliInfo.cmd!}" was not found in config file`
   }

   //* Getting script data
   const scriptData = scripts.scripts[cliInfo.cmd!]

   //* Getting script runtime configs: file, flags, custom file, app flags 
   const runFile = `${Deno.cwd()}/${scriptData.customFile ?? configs.config?.mainFile ?? defaultFile}`
   const runFlags = scriptData.flags?.split(' ') ?? []
   const appFlags = scriptData.appFlags?.split(' ') ?? []
   const env = scriptData.env ?? {}
   const runApp = ['deno', scriptData.invoker]
   //TODO Add .env file from config file and read it + include in env
   //TODO Add CLI env vars

   
   //*Checking if run file is directory or even exists 
   try {
      await Deno.stat(runFile)
   } catch (err) {
      console.error(`[ERROR] The provided/default config file path "${runFile}" was not found!`)
      Deno.exit(1)
   }
   if(!(await Deno.stat(runFile)).isFile) return {
      success: false,
      err_msg: `The used '${runFile}' isn't a file!`,
   }


   return {
      success: true,
      cmdData: {
         cmd: runApp.concat(runFlags, runFile, appFlags),
         env: env,
         //TODO add configurations to other Deno.run options
         stdout: 'inherit',
         stderr: 'inherit',
         stdin: 'inherit'
      },
      hasScripts: true,
   }

}