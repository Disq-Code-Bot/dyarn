//* Importing test deps
import { 
   assertEquals, 
   it,
   describe
} from '../../../test_deps.ts'

//* Importing tested module
import {
   cacheExists
} from '../../../src/config-file/config-cache.ts'

//* Importing suites and mocks
import {
   configCacheSuite
} from '../suite.ts'
import {
   testsValidityCheckCases
} from './tests-list.ts'

describe({
   name: 'VALIDITY',
   suite: configCacheSuite,
   
}, async () => {
   await Promise.all(testsValidityCheckCases.map(async testCase => {
      await it(testCase.testName, async () => {

         //* Mocking Deno's stat()
         globalThis.Deno.stat = async (path: string | URL): Promise<Deno.FileInfo> => {
            await new Promise(resolve => setTimeout(resolve, 10))
            const found = testCase.denoMocks.denoStat.find(stat => {
               return stat.path === path.toString()
            })
            if(!found) throw new Error(`Could not find stat mock for ${path}`)
            return found.return
         }
      
         //* Mocking Deno's readFile()
         globalThis.Deno.readFile = async (_path: string | URL): Promise<Uint8Array> => {
            await new Promise(resolve => setTimeout(resolve, 1))
            
            return new TextEncoder().encode(JSON.stringify(testCase.denoMocks.denoReadFile))
         }
         
         const {
            success,
            hasCache,
            isValid,
            err,
         } = await cacheExists(testCase.configFilePath, testCase.cliInfo)

         

         assertEquals(success, testCase.expected.success, `Expected success to be ${testCase.expected.success}`)
         assertEquals(hasCache, testCase.expected.hasCache, `Expected hasCache to be ${testCase.expected.hasCache}`)
         assertEquals(isValid, testCase.expected.isValid, `Expected isValid to be ${testCase.expected.isValid}`)
         assertEquals(err, testCase.expected.err, `Expected err to be ${testCase.expected.err}`)
      })
   }))
})