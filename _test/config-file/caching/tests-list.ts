import type {
   CLIInfo,
} from '../../../types/cli.d.ts'
import type {
   ConfigOptions,
   ConfigFileCacheType
} from '../../../src/config-file/config-types.d.ts'

import {
   cacheMockFilePath,
   denoJsonCacheMock1,
   denoJsonMock1
} from '../../mocks.ts'

const unusedDenoStatVars = { blksize: 0, blocks: 0, dev: 0, gid: 0, ino: 0, mode: 0, nlink: 0, rdev: 0, uid: 0, size: 0 }

//* Tests list for the config file cache validation and existence tests
export const testsValidityCheckCases: {
   testName: string
   configFilePath: string
   cliInfo: Partial<CLIInfo>
   expected: {
      success: boolean
      hasCache: boolean | undefined
      isValid: boolean | undefined
      err: string | undefined
   }
   denoMocks: {
      denoReadFile: any
      denoStat: {
         path: string
         return: Deno.FileInfo
      }[]
   }
}[] = [
   {
      testName: 'Cache exists and is valid',
      configFilePath: './deno.json',
      cliInfo: {
         cwd: '.',
      },
      denoMocks: {
         denoStat: [
            {
               path: './deno.json',
               return: {
                  isFile: true,
                  isDirectory: false,
                  isSymlink: false,
                  mtime: new Date(denoJsonCacheMock1.cacheDate),
                  atime: new Date(denoJsonCacheMock1.cacheDate),
                  birthtime: new Date(denoJsonCacheMock1.cacheDate),
                  ...unusedDenoStatVars
               } 
            },
            {
               path: cacheMockFilePath,
               return: {
                  isFile: true,
                  isDirectory: false,
                  isSymlink: false,
                  mtime: new Date(denoJsonCacheMock1.cacheDate),
                  atime: new Date(denoJsonCacheMock1.cacheDate),
                  birthtime: new Date(denoJsonCacheMock1.cacheDate),
                  ...unusedDenoStatVars
               }
            }
         ],
         denoReadFile: denoJsonCacheMock1
            
      },
      expected: {
         success: true,
         hasCache: true,
         isValid: true,
         err: undefined,
      },
   },
   {
      testName: 'Cache exists, is valid and older original config file',
      configFilePath: './deno.json',
      cliInfo: {
         cwd: '.',
      },
      denoMocks: {
         denoStat: [
            {
               path: './deno.json',
               return: {
                  isFile: true,
                  isDirectory: false,
                  isSymlink: false,
                  mtime: new Date(new Date(denoJsonCacheMock1.cacheDate).getTime() - 1000),
                  atime: new Date(new Date(denoJsonCacheMock1.cacheDate).getTime() - 1000),
                  birthtime: new Date(new Date(denoJsonCacheMock1.cacheDate).getTime() - 1000),
                  ...unusedDenoStatVars
               } 
            },
            {
               path: cacheMockFilePath,
               return: {
                  isFile: true,
                  isDirectory: false,
                  isSymlink: false,
                  mtime: new Date(denoJsonCacheMock1.cacheDate),
                  atime: new Date(denoJsonCacheMock1.cacheDate),
                  birthtime: new Date(denoJsonCacheMock1.cacheDate),
                  ...unusedDenoStatVars
               }
            }
         ],
         denoReadFile: denoJsonCacheMock1
            
      },
      expected: {
         success: true,
         hasCache: true,
         isValid: true,
         err: undefined,
      },
   },
   {
      testName: 'Cache exists but is not valid',
      configFilePath: './deno.json',
      cliInfo: {
         cwd: '.',
      },
      denoMocks: {
         denoStat: [
            {
               path: './deno.json',
               return: {
                  isFile: true,
                  isDirectory: false,
                  isSymlink: false,
                  mtime: new Date(new Date(denoJsonCacheMock1.cacheDate).getTime() + 1000),
                  atime: new Date(new Date(denoJsonCacheMock1.cacheDate).getTime() + 1000),
                  birthtime: new Date(new Date(denoJsonCacheMock1.cacheDate).getTime() + 1000),
                  ...unusedDenoStatVars
               } 
            },
            {
               path: cacheMockFilePath,
               return: {
                  isFile: true,
                  isDirectory: false,
                  isSymlink: false,
                  mtime: new Date(denoJsonCacheMock1.cacheDate),
                  atime: new Date(denoJsonCacheMock1.cacheDate),
                  birthtime: new Date(denoJsonCacheMock1.cacheDate),
                  ...unusedDenoStatVars
               }
            }
         ],
         denoReadFile: denoJsonCacheMock1
            
      },
      expected: {
         success: true,
         hasCache: true,
         isValid: false,
         err: undefined,
      },
   },
   {
      testName: 'Cache does not exist',
      configFilePath: './deno.json',
      cliInfo: {
         cwd: '.',
      },
      denoMocks: {
         denoStat: [
            {
               path: './deno.json',
               return: {
                  isFile: true,
                  isDirectory: false,
                  isSymlink: false,
                  mtime: new Date(denoJsonCacheMock1.cacheDate),
                  atime: new Date(denoJsonCacheMock1.cacheDate),
                  birthtime: new Date(denoJsonCacheMock1.cacheDate),
                  ...unusedDenoStatVars
               } 
            },
         ],
         denoReadFile: denoJsonCacheMock1
            
      },
      expected: {
         success: true,
         hasCache: false,
         isValid: false,
         err: undefined,
      },
   },
]

//* Tests list for the config file cache invalidation function 
export const testsInvalidateCases: {
   testName: string
   cacheFilePath: string
   fileRemovalSuccess: boolean,
   success: boolean
}[] = [
   {
      testName: 'Cache exists and invalidate succeeds',
      cacheFilePath: cacheMockFilePath,
      fileRemovalSuccess: true,
      success: true,
   },
   {
      testName: 'Cache does not exist',
      cacheFilePath: cacheMockFilePath,
      fileRemovalSuccess: false,
      success: false,
   },
]

//* Test list for the config file cache creation function
export const testsCreateCacheCases: {
   testName: string
   configFilePath: ConfigFileCacheType['cacheFilePath']
   cacheFilePath: string
   config: ConfigOptions
   cliInfo: CLIInfo
   configFileStat: Deno.FileInfo
   success: boolean
}[] = [
   {
      testName: 'Cache creation succeeds',
      configFilePath: './deno.json',
      config: denoJsonMock1,
      cacheFilePath: cacheMockFilePath,
      cliInfo: {
         cwd: '.',
      } as CLIInfo,
      configFileStat: {
         isFile: true,
         isDirectory: false,
         isSymlink: false,
         mtime: new Date(denoJsonCacheMock1.cacheDate),
         atime: new Date(denoJsonCacheMock1.cacheDate),
         birthtime: new Date(denoJsonCacheMock1.cacheDate),
         ...unusedDenoStatVars
      },
      success: true
   },
]

//* Test list for config file reading function
export const testsReadConfigFileCases: {
   testName: string
   cliInfo: CLIInfo
   configExpected: ConfigOptions
   cacheFileContent: ConfigFileCacheType
   success: boolean
}[] = [
   {
      testName: 'Cache get succeeds',
      cliInfo: {
         cwd: '.',
      } as CLIInfo,
      configExpected: denoJsonMock1,
      cacheFileContent: denoJsonCacheMock1,
      success: true,
   }
]