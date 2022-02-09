import { checkFlags } from '../dyarn-internal/flags-check.ts'
import { commands } from '../dyarn-internal/mod.ts'

export const invokeDyarnCommands = async (script: string, args: string[]): Promise<{
   success: true
} | {
   success: false
   notFound?: true
   err?: string
}> => {
   const command = commands.find(cmd => cmd.invoker === script)

   if(!command) return {
      success: false,
      notFound: true,
   }

   if(command.flags){
      const { success, err_msg } = checkFlags(args, command.flags)

      if(!success) return {
         success: false,
         err: err_msg!
      }
   }

   const runCommand = await command.run(args)

   if(runCommand.success) return runCommand
   else return {
      success: false,
      err: runCommand.err!
   }
}