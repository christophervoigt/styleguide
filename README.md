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

**ToDos:**
* Think about: Renaming "modules" folder. (e.g. "unit")
* Use dist folder as symlink in app. If not possible copy dist folder into app folder.
* Include fonts and media (images/ videos) if needed.
* Idea: Add README.md into subfolder in "modules" for documentation.
* Use environment variables.
* Bundle css files (node-sass).
* Generate app folder.
* Add code style check (airbnb eslint?).
* Include code copy button and highlightjs into styleguide
* Generate changelog file
* Think about: code diff view of refactorings.
