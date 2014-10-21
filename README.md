## Squareteam front [![Dependency Status](https://gemnasium.com/squareteam/front.svg)](https://gemnasium.com/squareteam/front)[![Build Status](https://travis-ci.org/squareteam/front.svg?branch=master)](https://travis-ci.org/squareteam/front)

## Important !

**Styles are in a submodule repo `front-styles` in "styles" folder, please remember to do :**

- `git submodule init`

- `git submodule update`


## Tasks

To build the production version, use :

`grunt build`


To develop, use : `grunt watch` or `grunt serve`

But ensure your env is setup by doing `npm install && bower install`


#### Change front version

Do the following :

* `grunt [patch|minor|major]`
