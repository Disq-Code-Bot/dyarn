import type {
   CLIInfo
} from '../../../types/cli.d.ts'

import {
   cacheMockFilePath,
   denoJsonCacheMock1
} from '../../mocks.ts'

const unusedDenoStatVars = { blksize: 0, blocks: 0, dev: 0, gid: 0, ino: 0, mode: 0, nlink: 0, rdev: 0, uid: 0, size: 0 }

export const testsCases: {
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