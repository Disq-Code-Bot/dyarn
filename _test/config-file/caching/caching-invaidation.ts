//* Importing test deps
import { 
   assertEquals, 
   assertStringIncludes,
   it,
   describe
} from '../../../test_deps.ts'

//* Importing tested module
import {
   invalidateCache
} from '../../../src/config-file/config-cache.ts'

//* Importing suites and mocks
import {
   configCacheSuite
} from '../suite.ts'
import {
   testsInvalidateCases
} from './tests-list.ts'

describe({
   name: 'INVALIDATION',
   suite: configCacheSuite,
}, async () => {
   await Promise.all(testsInvalidateCases.map(async (testCase) => {
      await it({
         name: testCase.testName,
      }, async () => {
         const fileRemovalErr = `ERR REMOVING TEST FILE: ${testCase.testName}`
         
         globalThis.Deno.remove = async (_path: string | URL) => {
            await new Promise(resolve => setTimeout(resolve, 1))
            if(testCase.fileRemovalSuccess) return 
            else throw new Error(fileRemovalErr)
         }

         const {
            success,
            err,
         } = await invalidateCache(testCase.cacheFilePath)

         assertEquals(success, testCase.success, `Expected success to be ${testCase.success}`)

         if(testCase.success) {
            assertEquals(err, undefined, `Expected err to be undefined`)
         } else {
            assertStringIncludes(err!, fileRemovalErr, `Expected err to be: \n "${fileRemovalErr}" \n\n but got: \n"${err}"`)
         }
      })
   }))
})