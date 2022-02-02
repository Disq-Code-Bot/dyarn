export interface Command {
   invoker: string,
   description?: string,
   flags?: CommandFlags
   run: (args: string[]) => Promise<{ success: true } | { success: false, err: string }>,
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
      run: help
   }
]