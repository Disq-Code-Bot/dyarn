import type { CLIInfo } from '../../types/cli.d.ts'
import { checkFlags } from '../dyarn-internal/flags-check.ts'
import { commands } from '../dyarn-internal/mod.ts'

export const invokeDyarnCommands = async (cliInfo: CLIInfo): Promise<{
   success: true
} | {
   success: false
   notFound?: true
   err?: string
}> => {
   const command = commands.find(cmd => cmd.invoker === cliInfo.cmd)

   if(!command) return {
      success: false,
      notFound: true,
   }

   if(command.flags){
      const { success, err_msg } = checkFlags(cliInfo.flags, command.flags)

      if(!success) return {
         success: false,
         err: err_msg!
      }
   }

   const runCommand = await command.run(cliInfo.flags)

   if(runCommand.success) return runCommand
   else return {
      success: false,
      err: runCommand.err!
   }
}