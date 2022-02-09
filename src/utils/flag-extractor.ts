export interface Flags {
   flagName: string
   flagValue: string | boolean
}
export type FlagsArray = Flags[] | undefined

export type CMD = string

export function flagExtractor(denoArgs: string[]): {
   flags: FlagsArray
   cmd: CMD
   err: undefined
} | {
   flags: undefined
   cmd: undefined
   err: string
} {
   const cmd = denoArgs[0]
   const args = Array.from(Deno.args).splice(1)

   if(!args) return {
      flags: undefined, 
      cmd,
      err: undefined
   }

   const argsMap = args.map((arg, i) => {
      //* Filtering what is not a flag name in case it is separated property
      if(!arg.match(/^(--|-)/)) return
      
      const flagName = arg.replace(/^(--|-)/, '').replace(/=.+$/, '').replace(/=/, '')
      
      const subSanitizedValue =  arg.replace(/^(--|-)[^\s]+=/, '')
      let flagValue: string | boolean
      try {
         flagValue = JSON.parse(subSanitizedValue)
      } catch {
         //* In case of error, it's not a JSON nor boolean
         flagValue = subSanitizedValue
      }

      const isSeparated = !arg.match(/=/)
      const nextItem = args[i + 1]

      if(isSeparated && (!nextItem || nextItem.match(/^(--|-)[^\s]+=/))) return {
         flagName,
         flagValue: true
      }
      else if(isSeparated) return {
         flagName,
         flagValue: nextItem
      } 
      else if(typeof flagValue === 'undefined') return {
         err: `Flag "${flagName}" has no value defined after it's \`=\` separator!`
      }
      return {
         flagName,
         flagValue
      }
   }).filter(arg => !!arg) 
   
   if(!argsMap) return {
      flags: undefined,
      cmd,
      err: undefined
   }

   const isThereError = argsMap.map(arg => arg!.err)
      .filter(arg => !!arg)

   if(isThereError.length > 0) return {
      flags: undefined,
      cmd: undefined,
      err: `The following error${isThereError.length > 1 ? 's' : ''} ocurred while trying to extract args: \n\n - ${isThereError.join('\n - ')}`
   }

   return {
      flags: argsMap as { 
         flagName: string,
         flagValue: string | boolean
      }[],
      cmd,
      err: undefined
   }
}