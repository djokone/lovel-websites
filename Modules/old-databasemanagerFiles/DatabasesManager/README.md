# Databases Manager

> Module to handle firestore database with common use case data strategies with Vuex & VuexOrm

With Database Manager you have differents strategies like loading, adding and deleting datas. These strategies give you a way to lasyload, reformate, subscribe at new changes and paginate your datas. With this every things should be easier to handle your datas as you need ;) 

## Quick start

### Install Databases Manager Module

If DatabasesManager is not present in your project, and you want to add it, you need add it first like as below. 
> The path _app/modules/DatabaseManager_ as a second command line argument is the path where you want to clone the submodule.

```bash
# Add databaseManager to a new project
git submodule add https://github.com/djokone/DatabasesManager app/modules/DatabaseManager

```

Now your submodule should existing in the path folder, but should be empty. To get all the code module you need to run this two command lines below.

```bash
# Install DatabasesManager Submodule to your project
git submodule init
git submodule update

```

## Setup Databases Manager

First to setup DatabaseManager you need to init the Firebase SDK and if you want the logger by default it use console object. After it's done just call initialize function, who's return the firebase.init() promise.

```js
// Add these lines to your main.js file
import DatabaseManager from "@/modules/DatabasesManager/DatabaseManager";
import * as firebase from "nativescript-plugin-firebase";

...
DatabaseManager.initSDK(firebase)
DatabaseManager.initLogger(DatabaseManagerLogger)
DatabaseManager.initialize({
    type: 'nativescript'
  })
  .then(instance => {
    AppLogger.log('firebase init done ' + DatabaseManager.currentId)
  })
  .catch(error => {
    AppLogger.error('firebase.iinit error')
    AppLogger.error(error)
  })
```

Databses Manager is Now ready to use

## Usage

