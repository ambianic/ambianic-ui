import { EdgeAPI } from '@/remote/edgeAPI.js'
import { PEER_CONNECTED, PEER_DISCONNECTED } from '@/store/mutation-types'
import { ambianicConf } from '@/config.js'

const API_HOST = ambianicConf.AMBIANIC_EDGE_HOST
const API_SCHEMA = ambianicConf.AMBIANIC_EDGE_API_SCHEMA
const API_PORT = ambianicConf.AMBIANIC_EDGE_API_PORT
const API_ROOT = ambianicConf.AMBIANIC_EDGE_API_ROOT

describe('PeerRoom class coverage - p2p communication layer', () => {
// global

  beforeAll(() => {
  })

  // mock pnp vuex state instance
  const pnp = jest.fn()

  beforeEach(() => {
    pnp.state = jest.fn()
    pnp.state.peerFetch = jest.fn()
    pnp.state.peerConnectionStatus = PEER_CONNECTED
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('EdgeAPI constructor', () => {
    const edgeAPI = new EdgeAPI(pnp)
    expect(edgeAPI.pnp).toBe(pnp)
  })

  test('EdgeAPI._getRootURL()', () => {
    const edgeAPI = new EdgeAPI(pnp)
    const rootURL = edgeAPI._getRootURL()
    expect(rootURL).toEqual(`${API_SCHEMA}://${API_HOST}:${API_PORT}/${API_ROOT}/`)
  })

  test('EdgeAPI._get()', async () => {
    pnp.state.peerFetch.request = jest.fn().mockReturnValue(
      {
        header: { status: 200 },
        content: '{event: "object_detection"}'
      }
    )
    const edgeAPI = new EdgeAPI(pnp)
    const response = await edgeAPI._get({ url: 'timeline' })
    expect(pnp.state.peerFetch.request).toHaveBeenCalledTimes(1)
    expect(pnp.state.peerFetch.request).toHaveBeenCalledWith({ method: 'GET', url: 'timeline' })
    expect(pnp.state.peerFetch.request).toHaveReturnedWith(
      {
        header: { status: 200 },
        content: '{event: "object_detection"}'
      }
    )
    expect(response).toEqual(
      {
        header: { status: 200 },
        content: '{event: "object_detection"}'
      }
    )
  })

  test('EdgeAPI._get() throws exception', async () => {
    pnp.state.peerFetch.request = jest.fn()
    pnp.state.peerConnectionStatus = PEER_DISCONNECTED
    const edgeAPI = new EdgeAPI(pnp)
    await expect(edgeAPI._get('wrong_parameter'))
      .rejects
      .toThrow(/^Cannot create property 'method'/)
    await expect(edgeAPI._get({ url: 'wrong_method' }))
      .rejects
      .toThrow('Edge device peer not connected.')
  })

  test('EdgeAPI._getJSON()', async () => {
    pnp.state.peerFetch.request = jest.fn().mockReturnValue(
      {
        header: { status: 200 },
        content: '{event: "object_detection"}'
      }
    )
    pnp.state.peerFetch.jsonify = jest.fn().mockImplementation((data) => data)
    const edgeAPI = new EdgeAPI(pnp)
    const response = await edgeAPI._getJSON({ method: 'GET', url: 'timeline' })
    expect(pnp.state.peerFetch.request).toHaveBeenCalledTimes(1)
    expect(pnp.state.peerFetch.request).toHaveBeenCalledWith({ method: 'GET', url: 'timeline' })
    expect(pnp.state.peerFetch.request).toHaveReturnedWith(
      {
        header: { status: 200 },
        content: '{event: "object_detection"}'
      }
    )
    expect(response).toEqual('{event: "object_detection"}')
  })

  test('EdgeAPI.getTimelinePage()', async () => {
    pnp.state.peerFetch.request = jest.fn().mockReturnValue(
      {
        header: { status: 200 },
        content: '{event: "object_detection"}'
      }
    )
    pnp.state.peerFetch.jsonify = jest.fn().mockImplementation((data) => data)
    const edgeAPI = new EdgeAPI(pnp)
    const response = await edgeAPI.getTimelinePage(4)
    expect(pnp.state.peerFetch.request).toHaveBeenCalledTimes(1)
    expect(pnp.state.peerFetch.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${API_SCHEMA}://${API_HOST}:${API_PORT}/${API_ROOT}/timeline`,
      params: {
        page: 4
      }
    })
    expect(pnp.state.peerFetch.request).toHaveReturnedWith(
      { 
        header: { status: 200 },
        content: '{event: "object_detection"}' 
      }
    )
    expect(response).toEqual('{event: "object_detection"}')
  })

  test('EdgeAPI.getEdgeStatus()', async () => {
    pnp.state.peerFetch.request = jest.fn().mockReturnValue({
      header: { status: 200 },
      content: '{ status: "OK",  version: "1.14.7"}'
    })
    pnp.state.peerFetch.jsonify = jest.fn().mockImplementation((data) => data)

    const edgeAPI = new EdgeAPI(pnp)
    const response = await edgeAPI.getEdgeStatus()

    expect(pnp.state.peerFetch.request).toHaveBeenCalledTimes(1)
    expect(pnp.state.peerFetch.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${API_SCHEMA}://${API_HOST}:${API_PORT}/${API_ROOT}/status`
    })

    expect(response).toEqual('{ status: "OK",  version: "1.14.7"}')
  })

  test('EdgeAPI.getImageURL()', async () => {
    window.URL.createObjectURL = jest.fn().mockReturnValue('http://localstore')
    pnp.state.peerFetch.request = jest.fn().mockReturnValue({ content: 'binary_image_data' })
    const edgeAPI = new EdgeAPI(pnp)
    const localImageURL = await edgeAPI.getImageURL('detection123', 'snapshot.png')
    expect(pnp.state.peerFetch.request).toHaveBeenCalledTimes(1)
    expect(pnp.state.peerFetch.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${API_SCHEMA}://${API_HOST}:${API_PORT}/${API_ROOT}/data/detection123/snapshot.png`
    })
    expect(localImageURL).toMatch('http://localstore')
  })

  test('EdgeAPI.getImageURL() throws exception', async () => {
    window.URL.createObjectURL = jest.fn().mockImplementation(
      (blob) => { throw new Error('Failed to create local image from blob') }
    )
    pnp.state.peerFetch.request = jest.fn().mockReturnValue(
      {
        header: { status: 200 },
        content: 'binary_image_data'
      }
    )
    const edgeAPI = new EdgeAPI(pnp)
    const localImageURL = await edgeAPI.getImageURL('detection123', 'snapshot.png')
    expect(localImageURL).toBeUndefined()
  })
})
