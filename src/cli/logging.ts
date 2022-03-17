import type { CLIInfo } from './../../types/cli.d.ts';
import {
   bgRgb24,
   rgb24,
   underline,
   bold,
   italic,
   dim,
   strikethrough
} from '../../deps.ts'

interface Rgb {
   r: number
   g: number
   b: number
}

interface Options {
   italic?: boolean
   bold?: boolean
   underline?: boolean
   dim?: boolean
   strikethrough?: boolean
}

//* Color constants
const warnColor: Rgb = {
   r: 255,
   g: 167,
   b: 89,
}
const verboseColor: Rgb = {
   r: 0,
   g: 191,
   b: 255,
}
const successColor: Rgb = {
   r: 136,
   g: 255,
   b: 125,
}
const errorColor: Rgb = {
   r: 255,
   g: 102,
   b: 115,
}
const neutralColor: Rgb = {
   r: 255,
   g: 255,
   b: 255,
}

function colorString(isBg: boolean, color: Rgb, msg: string, cliInfo: CLIInfo): string {
   if(cliInfo.flags!.find(flag => flag.flagName === 'no-color')?.flagValue) 
      return msg

   if(isBg) return bgRgb24(msg, color)
   else return rgb24(msg, color)
}

function fontFormat(msg: string, options: Options): string {
   let result = msg
   if(options.italic) result = italic(result)
   if(options.bold) result = bold(result)
   if(options.underline) result = underline(result)
   if(options.dim) result = dim(result)
   if(options.strikethrough) result = strikethrough(result)
   
   return result
}

//* Logging functions with background color 
export function bgLogNorm(msg: string, cliInfo: CLIInfo, opts: Options, color?: Rgb): void {
   const colorLog = colorString(true, color ?? neutralColor, msg, cliInfo)
   const formatLog = fontFormat(colorLog, opts)

   Deno.stdout.writeSync(new TextEncoder().encode(formatLog))
   return
}

export function bgLogSuccess(msg: string, cliInfo: CLIInfo, color?: Rgb): void {
   const colorLog = colorString(true, color ?? successColor, msg, cliInfo)

   Deno.stdout.writeSync(new TextEncoder().encode())
   return 
}

export function bgLogWarn(msg: string, cliInfo: CLIInfo, color?: Rgb): void {
   const colorLog = colorString(true, color ?? warnColor, msg, cliInfo)
   
   Deno.stdout.writeSync(new TextEncoder().encode(colorLog))
   return 
}

export function bgLogError(msg: string, cliInfo: CLIInfo, color?: Rgb): void {
   const colorLog = colorString(true, color ?? errorColor, msg, cliInfo)

   Deno.stdout.writeSync(new TextEncoder().encode(colorLog))
   return
}

export function bgLogVerbose(msg: string, cliInfo: CLIInfo, color?: Rgb): void {
   const colorLog = colorString(true, color ?? verboseColor, msg, cliInfo)

   if(cliInfo.verbose) 
      Deno.stdout.writeSync(new TextEncoder().encode(colorLog))
   return
}

//* Logging functions with text color
export function logNorm(msg: string, cliInfo: CLIInfo, opts: Options, color?: Rgb): void {
   const colorLog = colorString(false, color ?? neutralColor, msg, cliInfo)
   const formatLog = fontFormat(colorLog, opts)

   Deno.stdout.writeSync(new TextEncoder().encode(formatLog))
   return
}

export function logSuccess(msg: string, cliInfo: CLIInfo, color?: Rgb): void {
   const colorLog = colorString(false, color ?? successColor, msg, cliInfo)
   
   Deno.stdout.writeSync(new TextEncoder().encode(colorLog))
   return 
}

export function logWarn(msg: string, cliInfo: CLIInfo, color?: Rgb): void {
   const colorLog = colorString(false, color ?? warnColor, msg, cliInfo)
   
   Deno.stdout.writeSync(new TextEncoder().encode(colorLog))
   return 
}

export function logError(msg: string, cliInfo: CLIInfo, color?: Rgb): void {
   const colorLog = colorString(false, color ?? errorColor, msg, cliInfo)
   
   Deno.stdout.writeSync(new TextEncoder().encode(colorLog))
   return 
}

export function logVerbose(msg: string, cliInfo: CLIInfo, color?: Rgb): void {
   const colorLog = colorString(false, color ?? verboseColor, msg, cliInfo)

   if(cliInfo.verbose) 
      Deno.stdout.writeSync(new TextEncoder().encode(colorLog))
   return
}

//* Log a message with colored prefix
export function prefixLogSuccess(msg: string, cliInfo: CLIInfo): void {
   const colorPrefix = colorString(false, successColor, '[SUCCESS]', cliInfo)

   const composedMsg = `${colorPrefix} -> ${msg}`
   Deno.stdout.writeSync(new TextEncoder().encode(composedMsg))
   return
}

export function prefixLogWarn(msg: string, cliInfo: CLIInfo): void {
   const colorPrefix = colorString(false, warnColor, '[WARN]', cliInfo)

   const composedMsg = `${colorPrefix} -> ${msg}`
   Deno.stdout.writeSync(new TextEncoder().encode(composedMsg))
   return
}

export function prefixLogVerbose(msg: string, cliInfo: CLIInfo): void {
   const colorPrefix = colorString(false, verboseColor, '[VERBOSE]', cliInfo)

   const composedMsg = `${colorPrefix} -> ${msg}`
   Deno.stdout.writeSync(new TextEncoder().encode(composedMsg))
   return
}

export function prefixLogError(msg: string, cliInfo: CLIInfo): void {
   const colorPrefix = colorString(false, errorColor, '[ERR]', cliInfo)

   const composedMsg = `${colorPrefix} -> ${msg}`
   Deno.stdout.writeSync(new TextEncoder().encode(composedMsg))
   return
}