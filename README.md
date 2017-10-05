# styleguide project

sample project that may serve as module library and styleguide

## project structure

| path | description                              |
| ---- | ---------------------------------------- |
| src  | contains sourcecode of modules           |
| dist | contains compiled and reusable modules   |
| app  | contains the styleguide                  |

## build process

**TL;DR:**
```bash
npm run build
```

**Details:**

1. sources should be compiled to create a library
```bash
npm run build:dist
```

2. library and documentation sources are used to create a styleguide app
```bash
npm run build:app
```

**ToDo:**
* Generate app folder.
* Use /dist as symlink in /app. If not possible, copy /dist into /app.
* Include fonts and media (images/ videos) if needed.
* Use environment variables. Only minify on production.
* Generate changelog file
* Include code copy button and highlightjs into styleguide
---
* Idea: Add README.md into subfolder in "modules" for documentation.
* Idea: code diff view of refactorings. Problem: have to save 2 code states (old + new)
