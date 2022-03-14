import {
   dyarnProjectDirPath,
   configFileCacheFileName
} from '../src/global-defs.ts'

export const cacheMockFilePath = `./${dyarnProjectDirPath}/${configFileCacheFileName}`

export const denoJsonMock1 = {
   "dyarnOptions": {
      "noCache": true,
      "mainFile": "mod.ts",
      "scripts": {
         "dev": {
            "invoker": "run",
            "flags": "--watch --allow-env --allow-read=.env --allow-net=crates.io,developer.mozilla.org,discord.com,gateway.discord.gg,deno.land,www.npmjs.com"
         },
         "test:watch": {
            "invoker": "test",
            "customFile": "./__test__/test.ts",
            "flags": "--watch -A"
         },
         "test": {
            "invoker": "test",
            "flags": "-A",
            "customFile": "./__test__/test.ts"
         },
         "start": {
            "invoker": "run",
            "flags": "--allow-read=.env --allow-env --allow-net=crates.io,developer.mozilla.org,discord.com,gateway.discord.gg,deno.land,www.npmjs.com"
         }
      }
   }
}

export const denoJsonCacheMock1 = {
   cache: denoJsonMock1,
   configFileModDate: new Date(),
   configFilePath: './deno.json',
   cacheDate: new Date().toISOString(),
   cacheFilePath: cacheMockFilePath,
}