# Database manager

## How to add a new database

To add a new database, you must go to [firebaseLovelCloud.js](/front/Config/firebaseLovelCloud.js)
Then create a new object the following way:

```javascript
DatabaseManager.addDatabase({
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: ''
})
```
And complete it with all the relative informations about your new database.

## How to add a new entity

To add a new entity, you need to get into a module folder, here is the link: [Lovel-website-cakephp3/front/Modules](Lovel-website-cakephp3/front/Modules).

For each module, there is a **`Services`** folder, containing an **`action.js`**, an ***`Entityname`*****`.js`** and an ***`entitynames`*****`.js`**.
To create an entity, you must create these files in a **`Services`** folder.

Then follow the [vuex ORM manual](https://vuex-orm.github.io/vuex-orm/guide/prologue/getting-started.html#setup).

Now, add your ***`Entityname`*** to the [store.js](Lovel-website-cakephp3/front/Config/store.js) file, in the *`VuexORM Entities imports`* field, with its relative path.  
Same thing for your ***`entitynames`*** in the `Vuex store imports` field.

Now add a **`database.register(`*****`Entityname`*****`,`*****`entitynames`*****`)`** in the *`Register Local Store database`* field.

Next step is to add your ***`entitynames`*** in the *`const store = new Vuex.Store()`* object.

And finally, to allow the hot reload on your entity (recommended) add your ***`entitynames`*** relative path to the *`module.hot.accept`* list in the *`if (module.hot) {}`* condition.  
Add a **`const new`*****`Entitynames`*** `= require(` ***`entitynames`*** `relative path).default`, and a ***`entitynames:newEntitynames`*** , in *`store.hotUpdate ({})`*.