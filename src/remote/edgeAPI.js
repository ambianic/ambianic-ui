import { ambianicConf } from '@/config.js'

// const DEFAULT_API_ROOT = ambianicConf.AMBIANIC_API_FALLBACK_URI
const API_HOST = ambianicConf.AMBIANIC_EDGE_HOST
const API_PORT = ambianicConf.AMBIANIC_EDGE_API_PORT
const API_ROOT = ambianicConf.AMBIANIC_EDGE_API_ROOT

export class EdgeAPI {
  constructor (pnp) {
    this.pnp = pnp
  }

  _getRootURL () {
    var apiRoot = `http://${API_HOST}:${API_PORT}/${API_ROOT}/`
    return apiRoot
  }

  async _get (request) {
    if (!this.pnp.peerFetch) {
      throw Error('Edge device peer not connected.')
    } else {
      const response = await this.pnp.peerFetch.get(request)
      return response
    }
  }

  async _getJSON (request) {
    const response = await this._get(request)
    const jsn = this.pnp.peerFetch.jsonify(response.content)
    return jsn
  }

  /**
    Get one page of timeline as array of events.
  */
  async getTimelinePage (pageNum = 1) {
    const apiRoot = this._getRootURL()
    const timelineURL = apiRoot + 'timeline.json'
    let timelinePage = []
    const request = {
      url: timelineURL,
      params: {
        page: pageNum
      }
    }
    try {
      timelinePage = await this._getJSON(request)
    } catch (error) {
      console.error('Error fetching edge timeline', { error, request })
    }
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
      console.error('Error fetching edge timeline', { error, request })
    }
    return imageUrl
  }
}
