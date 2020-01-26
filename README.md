# Ambianic Client UI

[![npm version](https://badge.fury.io/js/ambianic-ui.svg)](https://badge.fury.io/js/ambianic-ui)
[![Greenkeeper badge](https://badges.greenkeeper.io/ambianic/ambianic-ui.svg)](https://greenkeeper.io/)
[![NodeJS CI](https://github.com/ambianic/ambianic-ui/workflows/Node%20CI/badge.svg)](https://github.com/ambianic/ambianic-ui/actions?query=workflow%3A%22Node+CI%22)
[![Netlify Status](https://api.netlify.com/api/v1/badges/70a4b25a-2765-4d6b-bbd8-a7e5dd6e98cb/deploy-status)](https://app.netlify.com/sites/happy-franklin-69b6d4/deploys)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fambianic%2Fambianic-ui.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fambianic%2Fambianic-ui?ref=badge_shield) 
[![CodeFactor](https://www.codefactor.io/repository/github/ambianic/ambianic-ui/badge)](https://www.codefactor.io/repository/github/ambianic/ambianic-ui)

Ambianic Client UI is an Offline-first Progressive Web App (PWA) to manage Ambianic Edge deployments.


<img src="public/img/ambianic-pwa-badge.png" width="600">

&nbsp;

The app is explicitly designed with user privacy and data ownership in mind:

* Stores data exclusively on user's own client device (desktop or mobile).
* Does not store ANY user information in the cloud.
* User may explicitly chose to store a backup of their data on a server of their choice.
* User data remains 100% owned and controlled by the user at all times.
* No fine print. No obscure opt-in / opt-out pop-ups of any kind.

# Project Status

An initial functional version of the web app is available. It pulls live timeline data from the edge device.
The UI app currently finds the correponding Ambianic Edge timeline feed via [`config.js`](config.js) located in the root app folder. Example config follows:
```js
// Ambianic client side configuration
export default {
  AMBIANIC_API_URI: 'http://192.168.86.246:8778/api/'
  // AMBIANIC_API_URI: '/sample-data/'
}
```

Live pre-release version of the web app is available here: https://ui.ambianic.ai/

Example screenshots on mobile and desktop:

<img src="public/img/ambianic-ui-mobile-screenshot.png" width="300">

&nbsp;

<img src="public/img/ambianic-ui-dekstop-screenshot.png" width="600">

&nbsp;

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

# Community Support 

If you have questions, ideas or cool projects you'd like to share with the Ambianic team and community, please use the [Ambianic Twitter channel](https://twitter.com/ambianicai).

# Acknowledgements

This project's initial version was inspired by
[David Garoro](https://github.com/davidgaroro)'s [PWA example](https://github.com/davidgaroro/vuetify-todo-pwa).


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fambianic%2Fambianic-ui.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fambianic%2Fambianic-ui?ref=badge_large)
