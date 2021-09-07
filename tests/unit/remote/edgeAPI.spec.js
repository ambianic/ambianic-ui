import { EdgeAPI } from '@/remote/edgeAPI.js'
import { PEER_CONNECTED, PEER_DISCONNECTED } from '@/store/mutation-types'
import { ambianicConf } from '@/config.js'

const API_HOST = ambianicConf.AMBIANIC_EDGE_HOST
const API_PORT = ambianicConf.AMBIANIC_EDGE_API_PORT
const API_ROOT = ambianicConf.AMBIANIC_EDGE_API_ROOT

describe('PeerRoom class coverage - p2p communication layer', () => {
// global

  beforeAll(() => {
  })

  // mock pnp vuex state instance
  const pnp = jest.fn()

  beforeEach(() => {
    pnp.peerFetch = jest.fn()
    pnp.peerConnectionStatus = PEER_CONNECTED
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
    expect(rootURL).toEqual(`http://${API_HOST}:${API_PORT}/${API_ROOT}/`)
  })

  test('EdgeAPI._get()', async () => {
    pnp.peerFetch.get = jest.fn().mockReturnValue({ content: '{event: "object_detection"}' })
    const edgeAPI = new EdgeAPI(pnp)
    const response = await edgeAPI._get('timeline')
    expect(pnp.peerFetch.get).toHaveBeenCalledTimes(1)
    expect(pnp.peerFetch.get).toHaveBeenCalledWith('timeline')
    expect(pnp.peerFetch.get).toHaveReturnedWith({ content: '{event: "object_detection"}' })
    expect(response).toEqual({ content: '{event: "object_detection"}' })
  })

  test('EdgeAPI._get() throws exception', async () => {
    pnp.peerFetch.get = jest.fn()
    pnp.peerConnectionStatus = PEER_DISCONNECTED
    const edgeAPI = new EdgeAPI(pnp)
    await expect(edgeAPI._get('wrong_method'))
      .rejects
      .toThrow('Edge device peer not connected.')
  })

  test('EdgeAPI._getJSON()', async () => {
    pnp.peerFetch.get = jest.fn().mockReturnValue({ content: '{event: "object_detection"}' })
    pnp.peerFetch.jsonify = jest.fn().mockImplementation((data) => data)
    const edgeAPI = new EdgeAPI(pnp)
    const response = await edgeAPI._getJSON('timeline')
    expect(pnp.peerFetch.get).toHaveBeenCalledTimes(1)
    expect(pnp.peerFetch.get).toHaveBeenCalledWith('timeline')
    expect(pnp.peerFetch.get).toHaveReturnedWith({ content: '{event: "object_detection"}' })
    expect(response).toEqual('{event: "object_detection"}')
  })

  test('EdgeAPI.getTimelinePage()', async () => {
    pnp.peerFetch.get = jest.fn().mockReturnValue({ content: '{event: "object_detection"}' })
    pnp.peerFetch.jsonify = jest.fn().mockImplementation((data) => data)
    const edgeAPI = new EdgeAPI(pnp)
    const response = await edgeAPI.getTimelinePage(4)
    expect(pnp.peerFetch.get).toHaveBeenCalledTimes(1)
    expect(pnp.peerFetch.get).toHaveBeenCalledWith({
      url: `http://${API_HOST}:${API_PORT}/${API_ROOT}/timeline`,
      params: {
        page: 4
      }
    })
    expect(pnp.peerFetch.get).toHaveReturnedWith({ content: '{event: "object_detection"}' })
    expect(response).toEqual('{event: "object_detection"}')
  })

  test('EdgeAPI.getEdgeStatus()', async () => {
    pnp.peerFetch.get = jest.fn().mockReturnValue({
      content: '{ status: "OK",  version: "1.14.7"}'
    })
    pnp.peerFetch.jsonify = jest.fn().mockImplementation((data) => data)

    const edgeAPI = new EdgeAPI(pnp)
    const response = await edgeAPI.getEdgeStatus()

    expect(pnp.peerFetch.get).toHaveBeenCalledTimes(1)
    expect(pnp.peerFetch.get).toHaveBeenCalledWith({
      url: `http://${API_HOST}:${API_PORT}/${API_ROOT}/status`
    })

    expect(response).toEqual('{ status: "OK",  version: "1.14.7"}')
  })

  test('EdgeAPI.getImageURL()', async () => {
    window.URL.createObjectURL = jest.fn().mockReturnValue('http://localstore')
    pnp.peerFetch.get = jest.fn().mockReturnValue({ content: 'binary_image_data' })
    const edgeAPI = new EdgeAPI(pnp)
    const localImageURL = await edgeAPI.getImageURL('detection123', 'snapshot.png')
    expect(pnp.peerFetch.get).toHaveBeenCalledTimes(1)
    expect(pnp.peerFetch.get).toHaveBeenCalledWith({
      url: `http://${API_HOST}:${API_PORT}/${API_ROOT}/data/detection123/snapshot.png`
    })
    expect(localImageURL).toMatch('http://localstore')
  })

  test('EdgeAPI.getImageURL() throws exception', async () => {
    window.URL.createObjectURL = jest.fn().mockImplementation(
      (blob) => { throw new Error('Failed to create local image from blob') }
    )
    pnp.peerFetch.get = jest.fn().mockReturnValue({ content: 'binary_image_data' })
    const edgeAPI = new EdgeAPI(pnp)
    const localImageURL = await edgeAPI.getImageURL('detection123', 'snapshot.png')
    expect(localImageURL).toBeUndefined()
  })
})
