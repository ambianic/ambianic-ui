import { ambianicConf } from '@/config.js'
import { PEER_CONNECTED } from '@/store/mutation-types'

// const DEFAULT_API_ROOT = ambianicConf.AMBIANIC_API_FALLBACK_URI
const API_HOST = ambianicConf.AMBIANIC_EDGE_HOST
const API_SCHEMA = ambianicConf.AMBIANIC_EDGE_API_SCHEMA
const API_PORT = ambianicConf.AMBIANIC_EDGE_API_PORT
const API_ROOT = ambianicConf.AMBIANIC_EDGE_API_ROOT

export class EdgeAPI {
  constructor (pnp) {
    this.pnp = pnp
  }

  _getRootURL () {
    var apiRoot = `${API_SCHEMA}://${API_HOST}:${API_PORT}/${API_ROOT}/`
    return apiRoot
  }

  async _request (config) {
    if (this.pnp.state.peerConnectionStatus !== PEER_CONNECTED) {
      throw Error('Edge device peer not connected.')
    } else {
      return await this.pnp.state.peerFetch.request(config)
    }
  }

  async _get (request) {
    request.method = 'GET'
    return await this._request(request)
  }

  async _put (request) {
    request.method = 'PUT'
    return await this._request(request)
  }

  async _getJSON (request) {
    const response = await this._get(request)
    if (response.header.status > 400) {
      // HTTP Error code in 400s or 500s. Something went wrong.
      throw Error(`HTTP Error Code: ${response.header.status}`)
    } else {
      const jsn = this.pnp.state.peerFetch.jsonify(response.content)
      return jsn
    }
  }

  async _putJSON (request) {
    const response = await this._put(request)
    if (response.header.status > 400) {
      // HTTP Error code in 400s or 500s. Something went wrong.
      throw Error(`HTTP Error Code: ${response.header.status}`)
    } else {
      const jsn = this.pnp.state.peerFetch.jsonify(response.content)
      return jsn
    }
  }

  /**
    Get one page of timeline as array of events.
  */
  async getTimelinePage (pageNum = 1) {
    const apiRoot = this._getRootURL()
    const timelineURL = apiRoot + 'timeline'
    let timelinePage = []
    const request = {
      url: timelineURL,
      params: {
        page: pageNum
      }
    }
    timelinePage = await this._getJSON(request)
    return timelinePage
  }

  /**
    Return full image URL given an image file name and a relative directory.

  */
  async getImageURL (relDir, imageName) {
    const apiRoot = this._getRootURL()
    const edgeImageUrl = apiRoot + 'data/' + relDir + '/' + imageName
    const request = {
      url: edgeImageUrl
    }
    var imageUrl
    try {
      const response = await this._get(request)
      var arrayBufferView = new Uint8Array(response.content)
      var blob = new Blob([arrayBufferView])
      var urlCreator = window.URL || window.webkitURL
      imageUrl = urlCreator.createObjectURL(blob)
    } catch (error) {
      console.error('Error fetching image file from edge', { error, request })
      imageUrl = undefined
    }
    return imageUrl
  }

  async getEdgeStatus () {
    const apiRoot = this._getRootURL()
    const request = {
      url: `${apiRoot}status`
    }
    return await this._getJSON(request)
  }

  async setDeviceDisplayName (newName) {
    const apiRoot = this._getRootURL()
    const esc = encodeURIComponent
    const urlEncodedName = esc(newName)
    const request = {
      url: `${apiRoot}device/display_name/${urlEncodedName}`
    }
    const response = await this._putJSON(request)
    console.debug('setDeviceDisplayName() received response', { request }, { response })
    return response
  }

  async auth () {
    console.debug('PEER_AUTHENTICATE auth() start')
    const authURL = `${API_SCHEMA}://${API_HOST}:${API_PORT}/`
    const request = {
      method: 'GET',
      url: authURL
    }
    console.debug('PEER_AUTHENTICATE API request:', request)
    console.debug('PEER_AUTHENTICATE this.pnp.state.peerFetch:', this.pnp.state.peerFetch)
    const response = await this.pnp.state.peerFetch.request(request)
    console.debug('PEER_AUTHENTICATE API response:', response)
    return response
  }
}
