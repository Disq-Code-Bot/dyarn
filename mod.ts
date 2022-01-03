import { PermsCheck } from './src/permCheck.ts'
import { ConfigFileCheck, defaultConfigFile } from './src/configFileCheck.ts'
import { RunApp } from './src/runner.ts'

const command = Deno.args[0] as string
const args = Deno.args.length !== 1 ?
   Deno.args.slice().splice(1, Deno.args.length - 1) as string[] 
   : [''] as string[]

await (async function main() {
   try {
      //* Checking if script has right permissions to run
      await PermsCheck()
      
      //* Getting config file path from command line or default
      let configFilePath
      if (Array.isArray(args)) args.forEach(arg => {
         if(RegExp(/^--config=([^\s].*)/).test(arg)) configFilePath = arg.replace(/^--config=/, '')
      })
      else configFilePath = defaultConfigFile
      
      //* Checking if config file exists and is has correct format
      const configFile = await ConfigFileCheck(configFilePath)
      
      //* Actually running user's app
      await RunApp(configFile, command)
   
      //* Voila, finished!
      Deno.exit(0)
   } catch(error) {
      console.log(`ERROR:\n ${error}`)
      Deno.exit(1)
   }
})()