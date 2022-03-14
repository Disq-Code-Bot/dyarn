import { 
   describe,
} from '../../test_deps.ts'

//* Importing tests
export const configFileTestSuite = describe({
   name: 'CONFIG FILE',
})

export const configCacheSuite = describe({
   name: 'CACHING',
   suite: configFileTestSuite,
})