import type { 
   FlagsArray,
   CMD
} from '../src/utils/flag-extractor.ts'

export interface CLIInfo {
   currDate: Date
   flags?: FlagsArray
   cmd?: CMD
   cwd?: string
   env?: Record<any, any>
   verbose?: boolean
}