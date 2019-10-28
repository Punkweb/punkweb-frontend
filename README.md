# punkweb-ngx

[![Build Status](https://travis-ci.org/Punkweb/punkweb-ngx.svg?branch=master)](https://travis-ci.org/Punkweb/punkweb-ngx)

Full featured and intended to keep project structure organized and consistent.

### Features

* Clean project structure.
* Electron integrated and flawlessly communicates with Angular through IPC.
* API service - easily communicate with REST backends - CRUD operations.
* Auth service - simple token authentication service.
* Websocket service - easily manage websocket connections.
* Modal module - globally accessible service to open any component as a modal - generic confirm modal.
* Calendar module - customizable date picker and date range components.
* Popover module - easily create tooltips, dropdowns, and popovers.
* Conforms with the punkweb styleguide - looks really nice out of the box - white labled and easily themeable.
* e2e and unit tests run headless and are able to pass CI testing (Travis and Gitlab tested).

## Install deps

Run `npm install`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Thanks for viewing!

I'm constantly trying to improve this template.  If you end up using this, please help out by reporting any issues you find, or features you think could be improved!
