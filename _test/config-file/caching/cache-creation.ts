
import type { 
   Spy
} from '../../../test_deps.ts'

//* Importing test deps
import { 
   assertEquals,
   assertStringIncludes, 
   assertSpyCall,
   spy,
   it,
   describe
} from '../../../test_deps.ts'

//* Importing tested module
import {
   createCache
} from '../../../src/config-file/config-cache.ts'

//* Importing suites and mocks
import {
   configCacheSuite
} from '../suite.ts'
import {
   testsCreateCacheCases
} from './tests-list.ts'

describe({
   name: 'CREATION',
   suite: configCacheSuite,
}, async () => {
   await Promise.all(testsCreateCacheCases.map(async (testCase, i) => {
      await it({
         name: testCase.testName,
      }, async () => {
         const writeSpy: Spy<Deno.File['write']> = spy((_write: Uint8Array): Promise<number> => {
            return Promise.resolve(1)
         })
         const closeSpy: Spy<Deno.File['write']> = spy((_write: Uint8Array): Promise<number> => {
            return Promise.resolve(1)
         })
         const createSpy: Spy<Deno.File> = spy(async (_path: string | URL): Promise<Deno.File> => {
            await new Promise(resolve => setTimeout(resolve, 10))
            return {
               write: writeSpy,
               close: closeSpy
            } as unknown as Deno.File
         })
         
         //* Setting up mocks and spies
         globalThis.Deno.create = createSpy

         const {
            success,
            err,
         } = await createCache(testCase.config, testCase.configFileStat, testCase.configFilePath, testCase.cliInfo)

         assertEquals(success, testCase.success)
         assertSpyCall(createSpy, i, {
            args: [testCase.cacheFilePath]
         })

         if(testCase.success) {
            assertEquals(err, undefined)

            //* Args expected by the the writeSpy
            const writeSpyArg = {
               cache: testCase.config,
               configFileModDate: testCase.configFileStat.mtime?.toISOString(),
               configFilePath: testCase.configFilePath,
               cacheDate: new Date().toISOString(),
               cacheFilePath: testCase.cacheFilePath,
            }
            
            assertSpyCall(writeSpy, i, {
               args: [new TextEncoder().encode(JSON.stringify(writeSpyArg))],
            })
            assertSpyCall(closeSpy, i)
         } else {
            assertStringIncludes(err!, `Couldn't write to config cache file!`)
         }
      })
   }))
})