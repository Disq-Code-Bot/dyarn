import {
   dyarnProjectDirPath
} from '../global-defs.ts'

export async function checkDyarnProjectDir(): Promise<{
   success: true
   err: undefined
} | {
   success: false,
   err: string
}> {
   try {
      await Deno.stat(dyarnProjectDirPath)
      return {
         success: true,
         err: undefined
      }
   }
   catch (err) {
      return {
         success: false,
         err: `There is no dyarn dir at ${dyarnProjectDirPath}`
      }
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