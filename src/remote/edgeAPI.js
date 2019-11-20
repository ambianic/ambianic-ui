import axios from 'axios'
import { ambianicConf } from '@/config.js'
import { settingsDB } from '@/store/db'

const DEFAULT_API_ROOT = ambianicConf.AMBIANIC_API_FALLBACK_URI
const API_PORT = ambianicConf.AMBIANIC_API_PORT
const API_ROOT = ambianicConf.AMBIANIC_API_ROOT

async function getRootURL () {
  let storedAddress = ''
  try {
    storedAddress = await settingsDB.get('ambanic-edge-address')
  } catch (error) {
    console.log(`Error reading from settingsDB: ${error}`)
  }
  let apiRoot = DEFAULT_API_ROOT
  if (storedAddress) {
    apiRoot = `http://${storedAddress}:${API_PORT}${API_ROOT}`
  }
  return apiRoot
}

/**
  Get one page of timeline events.
*/
export async function getTimelinePage (pageNum = 1) {
  let apiRoot = await getRootURL()
  let timelineURL = apiRoot + 'timeline.json'
  let timelinePage = []
  try {
    timelinePage = await axios.get(timelineURL, {
      params: {
        page: pageNum
      }
    })
  } catch (error) {
    console.log(`Error fetching timeline page: ${error}`)
  }
  return timelinePage
}

/**
  Return full image URL given an image file name and a relative directory.
*/
export async function getImageURL (relDir, imageName) {
  let apiRoot = await getRootURL()
  let p = apiRoot + 'data/' + relDir + '/' + imageName
  // console.debug('imagePath: ' + p)
  return p
}
