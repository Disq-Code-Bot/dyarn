//* Checking if script has right permissions to run

import messages from "./messages.json" assert { type: 'json' }

export async function PermsCheck(): Promise<void> {
   //* Checking if runner has read permission
   const readPermDesc = { name: "read" } as const
   const CheckReadPerm = await Deno.permissions.query(readPermDesc)

   if(CheckReadPerm.state !== "granted") {
      //* Requesting perm if not granted
      console.warn(messages.PermCheck.noReadAccessRecommendation)
      const readReq = await Deno.permissions.request(readPermDesc)

      if(readReq.state === "denied") throw new Error(messages.PermCheck.noReadAccess)
   } 

   //* Checking if runner has run permission
   const runPermDesc = { name: "run" } as const
   const CheckRunPerm = await Deno.permissions.query(runPermDesc)
   
   if(CheckRunPerm.state !== "granted") {
      //* Requesting perm if not granted
      console.warn(messages.PermCheck.noRunAccessRecommendation)
      const runReq = await Deno.permissions.request(runPermDesc)

      if(runReq.state === "denied") throw new Error(messages.PermCheck.noRunAccess)
   }
}