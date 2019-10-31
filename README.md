# Ambianic Client UI

[![Greenkeeper badge](https://badges.greenkeeper.io/ambianic/ambianic-ui.svg)](https://greenkeeper.io/)

Ambianic Client UI is an Offline-first Progressive Web App (PWA) to manage Ambianic Edge deployments.

The app is explicitly designed with user privacy and data ownership in mind:

* Stores data exclusively on user's own client device (desktop or mobile).
* Does not store ANY user information in the cloud.
* User may explicitly chose to store a backup of their data on a server of their choice.
* User data remains 100% owned and controlled by the user at all times.
* No fine print. No obscure opt-in / opt-out pop-ups of any kind.

# Project Status

An initial primitive version of the web app is available. It pulls live timeline data from the edge device. 

Live pre-release version of the web app is available here: https://ui.ambianic.ai/

Here is a screenshot:

<img src="https://raw.githubusercontent.com/ambianic/ambianic-ui/master/screenshot.png" width="600">

Next step: moving forward towards a more polished timeline UI.

## Installation & Setup
### Clone repository
```
git clone https://github.com/ambianic/ambianic-ui.git
cd ambianic-ui
```

### Install dependencies
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

# Acknowledgements

This project's initial version was inspired by
[David Garoro](https://github.com/davidgaroro)'s [PWA example](https://github.com/davidgaroro/vuetify-todo-pwa).

