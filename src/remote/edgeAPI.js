import axios from 'axios'
import { ambianicConf } from '@/config.js'
import { settingsDB } from '@/store/db'

const DEFAULT_API_ROOT = ambianicConf.AMBIANIC_API_FALLBACK_URI
const API_PORT = ambianicConf.AMBIANIC_API_PORT
const API_ROOT = ambianicConf.AMBIANIC_API_ROOT

async function getHostURL (address) {
  // console.debug(`address: ${address}`)
  try {
    if (address == null) {
      // console.debug(`loading stored address`)
      const storedAddress = await settingsDB.get('ambanic-edge-address')
      address = storedAddress
    }
    // console.debug(`address: ${address}`)
    const hostURL = `http://${address}:${API_PORT}`
    // console.debug(`hostURL: ${hostURL}`)
    return hostURL
  } catch (error) {
    console.log(`Error reading from settingsDB: ${error}`)
  }
}

async function getRootURL (address) {
  let apiRoot = DEFAULT_API_ROOT
  const hostURL = await getHostURL(address)
  if (hostURL) {
    apiRoot = `${hostURL}${API_ROOT}`
  }
  return apiRoot
}

/**
  Get one page of timeline events.
*/
export async function getTimelinePage (pageNum = 1, address = null) {
  const apiRoot = await getRootURL(address)
  const timelineURL = apiRoot + 'timeline.json'
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
  const apiRoot = await getRootURL()
  const p = apiRoot + 'data/' + relDir + '/' + imageName
  // console.debug('imagePath: ' + p)
  return p
}

export const EdgeConnectionStatus = {
  OFFLINE: 10,
  SERVER_UNAVAILABLE: 20,
  OK: 3
}

/**
  Test connection to remote edge device API.
*/
export async function testConnection (address) {
  // console.debug(`Preparing to test connection to address: ${address}`)
  const hostURL = await getHostURL(address)
  let status = EdgeConnectionStatus.OFFLINE
  let hostAvailable = null
  try {
    // console.debug(`Testing connection to host: ${hostURL}`)
    hostAvailable = await axios.get(hostURL)
  } catch (error) {
    console.log(`Error while testing connection to Ambianic Edge device web service: ${error}`)
  }
  if (hostAvailable) {
    // console.debug(`Testing API connection.`)
    const timelinePage = await getTimelinePage(1, address)
    if (timelinePage) {
      status = EdgeConnectionStatus.OK
    } else {
      status = EdgeConnectionStatus.SERVER_UNAVAILABLE
    }
  }
  // console.debug(`Ambianic Edge device connection status ${status}`)
  return status
}
