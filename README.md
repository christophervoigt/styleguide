# styleguide project

sample project that may serve as module library and styleguide

## project structure

| path | description                              |
| ---- | ---------------------------------------- |
| src  | contains sourcecode of modules           |
| lib  | contains compiled and reusable modules   |
| app  | contains the styleguide                  |

## build process

**TL;DR:**
```bash
npm run build
```

**Details:**

1. sources should be compiled to create a library
```bash
npm run build:lib
```

2. library and documentation sources are used to create a styleguide app
```bash
npm run build:app
```
