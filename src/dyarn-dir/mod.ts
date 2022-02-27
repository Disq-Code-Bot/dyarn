import {
   dyarnProjectDirPath
} from '../global-defs.ts'

export function checkDyarnProjectDir(): {
   success: true
   err: undefined
} | {
   success: false,
   err: string
} {
   const dir = Deno.statSync(dyarnProjectDirPath)

   if (!dir || !dir.isDirectory) return {
      success: false,
      err: `The directory "${dyarnProjectDirPath}" doesn't exist!`
   }

   return {
      success: true,
      err: undefined
   }
}

export async function createDyarnProjectDir(): Promise<{
   success: true
   err: undefined
} | {
   success: false,
   err: string
}> {
   const dir = await Deno.mkdir(
      new URL(dyarnProjectDirPath, import.meta.url).pathname, 
      { recursive: true }
   ).catch(err => 
      `Strange... something unexpected occurred when trying to create a .dyarn directory on your project's dir.\n [ERR MESSAGE]: ${err}`)

   if (typeof dir === 'string') return {
      success: false,
      err: dir
   }

   return {
      success: true,
      err: undefined
   }
}