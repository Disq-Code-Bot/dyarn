//* Checking if script has right permissions to run

const messages = {
   "noReadAccess" : "You must grant read access to this script to use it.",
   "noReadAccessRecommendation" : "Script has not been globally granted read access. \n You will be prompted to grant read access but it is recommended that you grant it globally.",
   "noRunAccess" : "You must grant run access to this script to use it.",
   "noRunAccessRecommendation" : "Script has not been globally granted run access. \n You will be prompted to grant run access but it is recommended that you grant it globally."
}

export async function PermsCheck(): Promise<void> {
   //* Checking if runner has read permission
   const readPermDesc = { name: "read" } as const
   const CheckReadPerm = await Deno.permissions.query(readPermDesc)

   if(CheckReadPerm.state !== "granted") {
      //* Requesting perm if not granted
      console.warn(messages.noReadAccessRecommendation)
      const readReq = await Deno.permissions.request(readPermDesc)

      if(readReq.state === "denied") throw new Error(messages.noReadAccess)
   } 

   //* Checking if runner has run permission
   const runPermDesc = { name: "run" } as const
   const CheckRunPerm = await Deno.permissions.query(runPermDesc)
   
   if(CheckRunPerm.state !== "granted") {
      //* Requesting perm if not granted
      console.warn(messages.noRunAccessRecommendation)
      const runReq = await Deno.permissions.request(runPermDesc)

      if(runReq.state === "denied") throw new Error(messages.noRunAccess)
   }
}