import type { ConfigOptions } from './global-defs.ts'
import { defaultFile } from './global-defs.ts'

const messages = {
   "invalidScript" : "No script found with this name",
   "noScriptInvoker" : "Please provide a Deno command defined on you scripts!",
   "noAppFile" : "Neither a custom file was provided nor the default one was found!",
   "appFileNotFound" : "Provided custom file was found. Provided/ran file:",
}

export async function RunApp(
   configFile: ConfigOptions, 
   command: string,
   ): Promise<void> {
   //* Checking if invoker is correct
   const scriptObject = configFile.scripts[command]
   if(!scriptObject) throw new Error(messages.noScriptInvoker)
   
   //* Getting script's Deno flags and invoker defined in config file
   let denoRun: string[]
   if(!scriptObject.denoFlags ||
      scriptObject.denoFlags.split(' ').length === 0) {
      denoRun = [] as string[]
   } else {
      const denoFlags = scriptObject.denoFlags.split(' ')
      denoRun = denoFlags
   }

   const filePath = scriptObject.customFile || configFile.mainFile || defaultFile
   const filePathCheck = Deno.statSync(`${Deno.cwd()}/${filePath}`)
   if(!filePathCheck.isFile && (scriptObject.customFile || configFile.mainFile)) 
      throw new Error(`${messages.appFileNotFound} ${scriptObject.customFile || configFile.mainFile}`)
   else if(!filePathCheck.isFile) 
      throw new Error(messages.noAppFile)

   const usrCustAppFlags = scriptObject.appFlags ?
      scriptObject.appFlags.split(' ') : [] as string[]

   //* Actually running the script
   let runner
   try {
      runner = Deno.run({ cmd: [
         'deno', scriptObject.invoker,
         ...denoRun,
         `${Deno.cwd()}/${filePath}`,
         ...usrCustAppFlags
      ] })
   } catch (error) {
      throw new Error(`UNEXPECTED ERROR:\n ${error}`)
   }

   //* Waiting for script to finish
   await runner.status()
}