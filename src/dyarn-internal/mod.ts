import { help } from './help/help-cmd.ts'

export interface Command {
   invoker: string,
   description?: string,
   flags?: CommandFlags
   run: (args: string[] | undefined) => Promise<{ success: true } | { success: false, err: string }>,
}

export interface  CommandFlags {
   required: boolean,
   arr: Array<{
      flag: string,
      required: boolean,
      description?: string,
      dependsOnFlag?: string[],
   }>
}

export const commands: Command[] = [
   {
      invoker: "help",
      description: "Prints this help message",
      run: () => help(),
   }
]