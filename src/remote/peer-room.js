/**
 * Local room management for a peer
*/
export class PeerRoom {
  // the peer this room is associated with
  _peer
  _roomId

  constructor (peer) {
    this._peer = peer
  }

  _buildUrl (path) {
    const protocol = this._peer.options.secure ? 'https://' : 'http://'
    let url =
      protocol +
      this._peer.options.host +
      ':' +
      this._peer.options.port +
      this._peer.options.path +
      this._peer.options.key +
      `/${this._peer.id}/${this._peer.options.token}/${path}`
    const queryString = '?ts=' + new Date().getTime() + '' + Math.random()
    url += queryString

    return url
  }

  async _restCall ({ method = 'GET', path }) {
    console.log('REST Call', method, path)
    const url = this._buildUrl(path)
    let response
    try {
      response = await fetch(url, { method })
      if (response.status !== 200) {
        throw new Error(`
          REST Error for ${path}.
          HTTP Response Status:${response.status}`)
      }
      const jsonResponse = await response.json()
      console.log('REST Call response', jsonResponse)
      return jsonResponse
    } catch (error) {
      const msg = `REST call failed for ${path}`
      console.error(msg, error)
      console.error('Response: ', response)
      throw new Error(msg, error)
    }
  }

  async _getRoomId () {
    const path = 'room/id'
    const result = await this._restCall({ path })
    if (result) {
      this._roomId = result.roomId
    }
    console.log('this roomId is ', this._roomId)
    return this._roomId
  }

  async _joinRoom () {
    const path = `room/${this._roomId}/join`
    const method = 'POST'
    const members = await this._restCall({ method, path })
    console.log('Joined room, Members', this._roomId, members)
    return members
  }

  async getRoomMembers () {
    let members
    if (!this._roomId) {
      members = await this.join()
    } else {
      const path = `room/${this._roomId}/members`
      members = await this._restCall({ path })
    }
    console.log('Room, members ', this._roomId, members)
    return members
  }

  async join () {
    if (!this._roomId) {
      this._roomId = await this._getRoomId()
    }
    const members = await this._joinRoom()
    return members
  }
}
