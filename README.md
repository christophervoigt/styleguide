# Styleguide

This sample project serves as a starting point for styleguides and module libraries.

[Learn More](https://chlorophyllkid.github.io/styleguide/)


## Setup

1.  make sure your system runs Node 7.6 or higher (`node -v`)
2.  clone this repository
3.  rename project and edit git remote
4.  run `npm install` in project root
5.  start development :smile:


## Project structure

| Path    | Description                                  |
| ------- | -------------------------------------------- |
| `app`   | contains the styleguide *(in .gitignore)*    |
| `dist`  | contains compiled and reusable modules       |
| `src`   | contains sourcecode, media and static assets |
| `tasks` | contains build and watch scripts             |


## NPM script overview

| Script       | Description                                  |
| ------------ | -------------------------------------------- |
| `start`      | runs build and watch task (for development)  |
| `build`      | builds `app` directory (for styleguide)      |
| `test`       | runs linting tests                           |
| `dist-patch` | builds `dist` directory and increments 0.0.x |
| `dist-minor` | builds `dist` directory and increments 0.x.0 |
| `dist-major` | builds `dist` directory and increments x.0.0 |


## Licence

[MIT](https://github.com/chlorophyllkid/styleguide/blob/master/LICENSE)
