# node-onesky

Node.js OneSky API Client

```
npm i node-onesky --save
```

Create an instance with your OneSky Public Key and Secret Key

```js
const OneSky = require("node-onesky").OneSky;
const onesky = new OneSky({
    PUBLIC_KEY: process.env.ONESKY_PUBLIC_KEY, 
    SECRET_KEY: process.env.ONESKY_SECRET_KEY
});
```

## Endpoints

### Locales

- #### List locales
  ```js
    const locales = await onesky.locales.list();
  ```
  
### Project Types

- #### List project types
  ```js
    const project_types = await onesky.project_types.list();
  ```

### Project Groups

- #### List project groups
  ```js
    const options = {
      per_page: 100, 
      page: 1
    };
    const project_groups = await onesky.project_groups.list(options);
  ```

- #### Create project group
  ```js
    const options = {
      name: "node-onesky-projectgroup-001", 
      locale: "es"
    };
    const project_group = await onesky.project_groups.create(options);
  ```

- #### Show project group
  ```js
    const project_group_id = process.env.ONESKY_PROJECT_GROUP_ID;
    const project_group = await onesky.project_groups.show(project_group_id);
  ```

- #### Delete project group
  ```js
    const project_group_id = process.env.ONESKY_PROJECT_GROUP_ID;
    const response = await onesky.project_groups.delete(project_group_id);
  ```

- #### List languages of a project group
  ```js
    const project_group_id = process.env.ONESKY_PROJECT_GROUP_ID;
    const languages = await onesky.project_groups.languages(project_group_id);
  ```

### Projects

- #### List projects in a project group
  ```js
    const project_group_id = process.env.ONESKY_PROJECT_GROUP_ID;
    const projects = await onesky.projects.list(project_group_id);
  ```
  
- #### Show project
  ```js
    const project_group_id = process.env.ONESKY_PROJECT_ID;
    const project = await onesky.projects.show(project_id);
  ```
  
- #### Create project
  ```js
    const project_group_id = process.env.ONESKY_PROJECT_GROUP_ID;
    const options = {
      project_type: "website",
      name: "node-onesky-project-001",
      description: "description"
    };
    const response = await onesky.projects.create(project_group_id, options);
  ```
  
- #### Update project
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      name: "node-onesky-project-001-upd",
      description: "description-upd"
    };
    const response = await onesky.projects.update(project_id, options);
  ```

- #### Delete project
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const response = await onesky.projects.delete(project_id);
  ```
  
- #### List languages of a project
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const response = await onesky.projects.languages(project_id);
  ```
  
### Files

- #### List files
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      per_page: 100,
      page: 1
    };
    const response = await onesky.files.list(project_id, options);
  ```

- #### Upload file
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const data = {
      locale: "en",
      file: {
        // value: fs.createReadStream("./test.json"),
        value: JSON.stringify({"Hello": "Hello", "Welcome": "Welcome"}),
        options: {filename: 'en.json'}
      },
      file_format: "HIERARCHICAL_JSON"
    };
    
    const response = await onesky.files.upload(project_id, data);
  ```
  
- #### Delete file
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      file_name: "en.json"
    };
    await onesky.files.delete(project_id, options);
  ```  
  
### Quotations

- #### Show quotation
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      files: ["en.json"],
      to_locale: "es"
    };
    const quotation = await onesky.quotations.show(project_id, options);
  ```
  
### Orders

- #### List orders
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      file_name: "en.json",
      per_page: 100,
      page: 1
    };
    const orders = await onesky.orders.list(project_id, options);
  ```
  
- #### Show order
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const order_id = process.env.ONESKY_ORDER_ID;
    await onesky.orders.show(project_id, order_id);
  ```

- #### Create order
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      files: ["en.json"],
      to_locale: "zh-TW"
    };
    await onesky.orders.create(project_id, options);
  ```

### Tasks

- #### List tasks
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      per_page: 100,
      page: 1,
      status: "completed"         // all*|completed|in-progress|failed
    };    
    await onesky.tasks.list(project_id, options);
  ```

- #### Show task
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const import_id = process.env.ONESKY_IMPORT_ID;
    await onesky.tasks.show(project_id, import_id);
  ```

### Translations

- #### Export translations
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      locale: "en", 
      source_file_name: "en.json", 
      export_file_name: "en-export.json"
    };
    await onesky.translations.export(project_id, options);
  ```

- #### Export translations multilingual
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      source_file_name: "en.json",
      export_file_name: "en-export-multi.json",
      file_format: "I18NEXT_MULTILINGUAL_JSON"
    };
    await onesky.translations.export_multilingual(project_id, options);
  ```

- #### Export translations app descriptions
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      locale: "es"
    };
    await onesky.translations.export_appdescriptions(project_id, options);
  ```

- #### Get translation status
  ```js
    const project_id = process.env.ONESKY_PROJECT_ID;
    const options = {
      file_name: "en.json",
      locale: "es"
    };
    await onesky.translations.status(project_id, options);
  ```
