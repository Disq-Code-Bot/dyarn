<h2 align='center'>Dyarn</h2>

### **General info**
Dyarn: the Deno runner help. 

After the Disq Code Bot team discovered Deno and some of it's magic with typescript, we decided using it instead of Node. But we only missed two little things: the ```package.json``` with it's scripts property and the ```yarn <script>``` (or ```npm run <script>``` if you prefer). So we created dyarn, to help you with running scripts using deno.json file that is supported by Deno and that latter be automatically imported (based on Deno's documentation: https://deno.land/manual/getting_started/configuration_file).

We plan on maybe adding some more things that we miss from Node's packages managers, to make Deno workflow even more efficient. 

If you have any suggestion, don't mind opening an issue please!!

---
### **Technologies**
Dependency free!

---
### **Setup**
> Note: Deno must be installed in your local environment. Tested on version 1.17, if you spot a problem in other versions, please do not hesitate opening an issue

* **...Download**
```bash 
# Using Deno install
deno install --allow-run --allow-read --allow-net --name dyarn https://deno.land/x/dyarn/mod.ts
```
> **Note**: You must give run, read and net permissions, to script (if not given at install you'll be prompted at runtime, but we highly recomed to grant at install, we are trying to make things easier, not adding additional prompts). Otherwise, script won't be able to access/run required files
---
### **Usage**
After installing... 
...Run one of Dyarn's [built-in commands](#embuilt-in-commandsem)

...or in your project's root directory, add a ```deno.json``` file where we'll add the scripts config: 

> [more about the config file](#emconfigs-fileem)

```json
{
   "dyarnOptions": {
      //Here you'll pass you main file path, by default runner will search for a "mod.ts" file in the current running directory
      "mainFile": "mod.ts",
      //Here you'l provide all your scripts with their command/alias, Deno command and Deno flags
      "scripts": {
         "dev": {
            //Deno original commands
            "invoker": "run",
            //Deno original flags
            "flags": "--watch --all"
         }
      }
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
### *Built in commands*
Here are the Deno's built in commands (you may also run ``dyarn help`` ). 
> Be aware, if your custom commands conflict with dyarn one's names, dyarn built in commands will be ran instead

- ``help``: Shows you the help message. Flags:
   - ~~``--cmd=``: This flag is optional and will show you specific commands help. (Still not available for al commands srry, but all are listed here in this Readme, so don't worry about hidden commands). Only works with Dyarn's built in commands~~ still unavailable sorry
- ``issues``: Shows the url to Dyarn repo's issues
- ``version``: Shows the current Dyarn version
   - ``--all`` | ``-a``: Shows the most recent and all versions in addition to the current one
- ~~``update``: Updates your Dyarn command line~~ still not available sorry

> **Dyarn also has some global flags**
- ```--config=```: if you wan't to create a custom dyarn config file or put it in a custom directory and use it when running your custom scripts

---
### *Flags*
- ``-c=[value]``, ``--config=[value]``, ``--config [value]`` and  ``-c [value]``: Sets the custom used config file path. (Be aware that if the flag is used multiple times, only the last one will be considered/used). e.g.: ``dyarn run --config ../disq-code/deno.json``, ``dyarn run --config ./config.json``
- ~~``--env [value]``, ```--env=[value]``~~ still not available 
- ``--no-cache``, ```--no-cache=[boolean]``: Opts you out of config file caching.

---
### *Configs file*
As our objective is to make you life a little easier with Deno commands, adding a custom config file or adding more flags, well... wouldn't help a lot. (if no custom path is provided with the flags ``-c=``, ``--config=``, ``--config`` and  ``-c`` dyarn will search for it's default one ``deno.json``)
> Note: If more than one config file path is provided, the last one provided will be the used one!

All dyarn options should be passed inside the ```dyarnOptions``` keys inside the deno.json file. 
```json
{
   "dyarnOptions": {
      //...
      // Your options here
   }
}
```

*And here is the json schema/options:*

- *optional:* ```mainFile```: Your main file that will be ran by default. Is not required and if not defined will look for a ```mod.ts``` file.
- *optional:* ```scripts```: Here you'll pass all the scripts you want to use with dyarn inside an object. The scripts keys will be the commands used when running dyarn... e.g.: in dyarn config ```"scripts": { "dev": {...} }}``` will be dyarn dev in your CLI. At least one script is strictly required (why? well for the moment if it isn't for this, dyarn is basically useless. We plan on adding more functionalities, but for the moment this is it). Each script is an object that accepts the following properties: 
   - ```invoker```: the original Deno command that Deno will run when you run dayrn with the respective script (parent key). This option is required in every script
   - *optional:* ```flags```: the original Deno flags that Deno will run along with the Deno invoker when you use dyarn. This option is not required. This way your app will run with no permissions. Dyarn will pass them before passing your file path
   (More about [Deno flags](https://deno.land/manual@v1.17.2/getting_started/permissions))
   - *optional:* ```file```: in case you wan't to run a different file for this specific script, you may use this option. As the other options, it does not affect your other scripts. This option is not required. (may be useful for running test por example, which normally requires to reference a different file, e.g.: ```_tests/test_mod.ts```)
      > Note: If defined, will override your ```mainFile``` option in dyarn's root config for this script
   - *optional:* ```appFlags```: you may sometimes define flags inside your own apps, so we added this where you can put them. As they are custom and should be read by your app, Dyarn passes them after passing your app path on the CLI, just as when running Deno command's directly in the CLI. Not required and have no influence neither on Deno nor Dyarn.
   - *optional:* ```env```: in case you need to define some env variables inside your app, you may define them here. This option is optional and has an object format with any key/value type:
      - ```[key: any]: any```

---
### *Contributing*
For contributions, you may open an issue or pull request, we will give a look into it and decide wha't should be done. 
But before consider following these for:
- new features: fork this repo and create a new branch under this name format "feature/<feature-name>" 
- fixes: fork this repo and create a new branch following this format "fix/<fix-name>" 
(in both cases open a pul request when finished)

### *Fun fact*
Yes, we use dyarn to develop and test... well, dyarn... Kinda paradoxical don't you think?

Like, using a wrench to fix this same wrench...?