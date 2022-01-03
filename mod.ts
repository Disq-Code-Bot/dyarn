import { PermsCheck } from './src/permCheck.ts'
import { ConfigFileCheck } from './src/configFileCheck.ts'
import { RunApp } from './src/runner.ts'

import specs from './src/specs.json' assert {type: 'json'}

const command = Deno.args[0] as string
const args = Deno.args.shift() as string[] | string

(async function main() {
   try {
      //* Checking if script has right permissions to run
      await PermsCheck()
      
      //* Getting config file path from command line or default
      let configFilePath
      if(typeof args === 'string' && RegExp(/^--config=./).test(args)) 
         configFilePath = args.replace(/^--config=/, '')
      else if (Array.isArray(args)) args.forEach(arg => {
         if(RegExp(/^--config=./).test(arg)) configFilePath = arg.replace(/^--config=/, '')
      })
      else configFilePath = specs.defaultConfigFile

      //* Checking if config file exists and is has correct format
      const configFile = await ConfigFileCheck(configFilePath)
      
      //* Actually running user's app
      await RunApp(configFile, command)
   
      //* Voila, finished!
      Deno.exit(0)
   } catch(error) {
      console.log(`UNEXPECTED ERROR:\n ${error}`)
      Deno.exit(1)
   }
})()