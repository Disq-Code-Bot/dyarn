import type { ConfigOptions } from './configFileCheck.ts'

const messages = {
   "invalidScript" : "No script found with this name",
   "noScriptInvoker" : "Please provide a Deno command for each script!"
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

   //* Actually running the script
   let runner
   try {
      runner = Deno.run({ cmd: [
         Deno.execPath(), scriptObject.invoker,
         ...denoRun,
         `${Deno.cwd()}/${configFile.mainFile}`
      ] })
   } catch (error) {
      throw new Error(`UNEXPECTED ERROR:\n ${error}`)
   }

   //* Waiting for script to finish
   await runner.status()
}