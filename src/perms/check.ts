//* Checking if script has right permissions to run

export async function PermsCheck(): Promise<{
   success: true
   err: undefined
} | {
   success: false
   err: string
}> {
   //* Checking if runner has read permission
   const readPermDesc = { name: "read" } as const
   const CheckReadPerm = await Deno.permissions.query(readPermDesc)

   if(CheckReadPerm.state !== "granted") {
      //* Requesting perm if not granted
      //TODO Add as optional with --verbose flag
      //console.warn(`It is highly recommended that you grant read permission to the runner at installation time!`)
      const readReq = await Deno.permissions.request(readPermDesc)

      if(readReq.state === "denied") return {
         success: false,
         err: `You must grant Dyarn read access to use it!!`
      }
   } 

   //* Checking if runner has run permission
   const runPermDesc = { name: "run" } as const
   const CheckRunPerm = await Deno.permissions.query(runPermDesc)
   
   if(CheckRunPerm.state !== "granted") {
      //* Requesting perm if not granted
      //TODO Add as optional with --verbose flag
      //console.warn(`It is highly recommended that you grant run permission to the runner at installation time!`))
      const runReq = await Deno.permissions.request(runPermDesc)

      if(runReq.state === "denied") return {
         success: false,
         err: `You must grant Dyarn run access to use it!!`
      }
   }

   return {
      success: true,
      err: undefined
   }
}