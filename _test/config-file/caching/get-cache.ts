//* Importing test deps
import { 
   assertEquals, 
   assertStringIncludes,
   it,
   describe
} from '../../../test_deps.ts'

//* Importing tested module
import {
   getCache
} from '../../../src/config-file/config-cache.ts'

//* Importing suites and mocks
import {
   configCacheSuite
} from '../suite.ts'
import {
   testsReadConfigFileCases
} from './tests-list.ts'

describe({
   name: 'GET CACHE',
   suite: configCacheSuite,
   
}, async () => {
   await Promise.all(testsReadConfigFileCases.map(async testCase => {
      await it(testCase.testName, async () => {
         //* Mocking Deno's stat()
         globalThis.Deno.readFileSync = (_path: string | URL): Uint8Array => {
            if(!testCase.success) throw new Error('ERR READING TEST FILE')
            return new TextEncoder().encode(JSON.stringify(testCase.cacheFileContent))
         }
         
         const {
            success,
            cache,
            err,
         } = await getCache(testCase.cliInfo)

         assertEquals(success, testCase.success, `Expected success to be ${testCase.success}`)
         
         if(testCase.success) {
            assertEquals(cache, testCase.configExpected, `Expected cache to be ${testCase.configExpected}`)
            assertEquals(err, undefined, `Expected err to be undefined`)
         } else {
            assertEquals(cache, undefined, `Expected cache to be undefined`)
            assertStringIncludes(err!, 'ERR READING TEST', `ERR READING TEST`)
         }
      })
   }))
})