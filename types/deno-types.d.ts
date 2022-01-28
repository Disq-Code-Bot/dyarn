export interface RunOptions {
   /** Arguments to pass. Note, the first element needs to be a path to the
    * binary */
   cmd: string[] | [URL, ...string[]];
   cwd?: string;
   env?: {
     [key: string]: string;
   };
   stdout?: "inherit" | "piped" | "null" | number;
   stderr?: "inherit" | "piped" | "null" | number;
   stdin?: "inherit" | "piped" | "null" | number;
}