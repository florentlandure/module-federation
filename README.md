# Module federation example

This is an example of using module federation (webpack 5) and web components.

There are 3 apps:

- Host [docs](./host/README.md)
- Angular addon [docs](./angular-addon/README.md)
- Vue addon [docs](./vue-addon/README.md)

## Setup

- Run `npm install` in the root folder.
- Run `npm install` in each app folder.

## Run the apps

```bash
npm run start:all
```

Open http://localhost:3000 to see the combined web app.

Each app can be opened as a standalone:

- Angular addon: http://localhost:4000
- Vue addon: http://localhost:4001
