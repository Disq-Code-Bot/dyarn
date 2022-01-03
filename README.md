<h2 align='center'>Dyarn</h2>

### **General info**
Dyarn: the Deno runner help. 

After the Disq Code Bot team discovered Deno and some of it's magic with typescript, we decided using it instead of Node. But we only missed two little things: the ```package.json``` with it's scripts property and the ```yarn <script>``` (or ```npm run <script>``` if you prefer). So we created dyarn, to help you with running scripts using config.json file that is supported by Deno and that latter be automatically imported (based on Deno's documentation: https://deno.land/manual@v1.17.1/getting_started/configuration_file).

We plan on maybe adding some more things that we miss from Node's packages managers, to make Deno workflow even more efficient. 

If you have any suggestion, don't mind opening an issue please!!

---
### **Technologies**
No deps. used... 


---
### **Setup**
> Note: Deno must be installed in your local environment. Tested on version 1.17, if you spot a problem in other versions, please do not hesitate opening an issue

* **...Download**
```bash 
# Using Deno install
deno install --allow-run --allow-read --name dyarn https://deno.land/x/dyarn@v1.0.1/mod.ts
```
> **Note**: You must give run and read permissions, to script (if not given at install you'll be prompted at runtime, but we highly recomed to grant at install, we are trying to make things easier, not adding additional prompts). Otherwise, script won't be able to access/run required files

* **...Usage**
After installing, in your project's root directory, add a ```config.json``` file where we'l add the scripts config. You may if you want create a custom named file in a custom path, for that provide the flag ```--config=``` with a path to your config file (e.g.: ```dyarn <script> --config=src/config.json```).

The config file format (you may pass other options accepted by Deno)
```json
{
   "dyarnOptions": {
      //Here you'll pass you main file path, by default runner will search for a "mod.ts" file in the current running directory
      "mainFile": "<file>",
      //Here you'l provide all your scripts with their command/alias, Deno command and Deno flags
      "scripts": [
         "<script command/alias>": {
            "invoker": "<the command you willing to run>",
            "flags": "<Deno flags to run with the script: permissions, configs, etc...>"
         }
      ]
   }
}
```

* **... finally running**
```bash
dyarn <script name> <dyarn flags>
```
Voila, you should be able to see your script running...

---
### *Uninstalling*
```bash
deno uninstall dyarn
```

--- 
### *Contributing*
For contributions, you may open an issue or pull request, we will give a look into it and decide wha't should be done. 
But before consider following these for:
- new features: fork this repo and create a new branch under this name format "feature/<feature-name>" 
- fixes: fork this repo and create a new branch following this format "fix/<fix-name>" 
(in both cases open a pul request when finished)