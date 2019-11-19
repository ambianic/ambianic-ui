import axios from 'axios'
import ambianicConf from '../../config.js'
import { settingsDB } from '@/store/db'


const DEFAULT_API_ROOT = ambianicConf['AMBIANIC_API_URI']
const API_TIMELINE_PATH = API_ROOT + 'timeline.json'
const PAGE_SIZE = 5
const api = API_TIMELINE_PATH


getAPIRoot () {
  settingsDB.get('ambanic-edge-address').then( (storedAddress) => {
    if (storedAddress) {
      apiRoot = 'http://' + storedAddress + '/api/'
    } else {
      apiRoot = DEFAULT_API_ROOT
    }
  })
}

/**
Get one page of timeline events.
*/
export getTimelinePage (pageNum=1) {
  return axios.get(api, {
    params: {
      page: pageNum
    }
  })
}

export getImageURL (relDir, imageName) {
  let p = API_ROOT + 'data/' + relDir + '/' + imageName
  // console.debug('imagePath: ' + p)
  return p
},
