import { PeerRoom } from '@/remote/peer-room.js'
import { enableFetchMocks } from 'jest-fetch-mock'
import fetchMock from 'jest-fetch-mock'

describe('PeerRoom class coverage - p2p communication layer', () => {
// global

  beforeAll(() => {
    enableFetchMocks()
  })

  // mock peer instance
  let peer

  beforeEach(() => {
    peer = jest.fn()
    peer.id = 'id_6789'
    peer.options = {
      secure: true,
      host: 'a_host',
      port: '567',
      path: '/a_path/',
      key: 'a_key',
      token: 'token_9876'
    }
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789)
    jest.spyOn(global.Date.prototype, 'getTime').mockReturnValue(987655421)
  })

  afterEach(() => {
    jest.resetAllMocks()
    fetchMock.resetMocks()
  })

  test('PeerRoom constructor', () => {
    const peerRoom = new PeerRoom('a_peer_instance')
    expect(peerRoom._peer).toBe('a_peer_instance')
    expect(peerRoom._peerRoom).toBeUndefined()
  })

  test('_buildUrl() - secure', () => {
    const peerRoom = new PeerRoom(peer)
    const url = peerRoom._buildUrl('sub_path')
    expect(url).toBe('https://a_host:567/a_path/a_key/id_6789/token_9876/sub_path?ts=9876554210.123456789')
  })

  test('_buildUrl() - not-secure', () => {
    peer.options.secure = false
    const peerRoom = new PeerRoom(peer)
    const url = peerRoom._buildUrl('sub_path')
    expect(url).toBe('http://a_host:567/a_path/a_key/id_6789/token_9876/sub_path?ts=9876554210.123456789')
  })

  test('_restCall()', async () => {
    const peerRoom = new PeerRoom(peer)
    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
    const result = await peerRoom._restCall({ method: 'GET', path: 'hello' })
    expect(result).toEqual({ data: '12345' })
  })

  test('exception in _restCall()', async () => {
    const peerRoom = new PeerRoom(peer)
    fetchMock.mockResponseOnce(req => Promise.reject(new Error('bad url')))
    await expect(peerRoom._restCall({ method: 'GET', path: 'bad_hello' }))
      .rejects.toThrow('REST call failed for bad_hello')
  })

  test('non 200 status response in _restCall()', async () => {
    const peerRoom = new PeerRoom(peer)
    fetchMock.mockResponseOnce('{}', { status: 404 })
    await expect(peerRoom._restCall({ method: 'GET', path: 'unavailable_url' }))
      .rejects.toThrow('REST call failed for unavailable_url')
  })

  test('_getRoomId()', async () => {
    const peerRoom = new PeerRoom(peer)
    fetchMock.mockResponseOnce(JSON.stringify({ roomId: '12345' }))
    const result = await peerRoom._getRoomId()
    expect(result).toEqual('12345')
    expect(peerRoom._roomId).toEqual('12345')
  })

  test('_joinRoom() API returns no room id', async () => {
    const peerRoom = new PeerRoom(peer)
    peerRoom._roomId = '5757'
    fetchMock.mockResponseOnce(JSON.stringify(['1', '2', '3']))
    const roomMembers = await peerRoom._joinRoom()
    expect(roomMembers).toEqual(['1', '2', '3'])
  })

  test('getRoomMembers() API returns no room id', async () => {
    const peerRoom = new PeerRoom(peer)
    peerRoom._roomId = '5757'
    fetchMock.mockResponseOnce(JSON.stringify(['1', '2', '3']))
    const roomMembers = await peerRoom.getRoomMembers()
    expect(roomMembers).toEqual(['1', '2', '3'])
  })

  test('getRoomMembers() while roomId is not known yet', async () => {
    const peerRoom = new PeerRoom(peer)
    peerRoom._roomId = undefined
    fetchMock
      .once([
        JSON.stringify({ roomId: '6556' })
      ])
      .once([
        JSON.stringify(['61', '62', '63'])
      ])
    const roomMembers = await peerRoom.getRoomMembers()
    expect(roomMembers).toEqual(['61', '62', '63'])
  })

  test('join() API returns no room id', async () => {
    const peerRoom = new PeerRoom(peer)
    peerRoom._roomId = '8989'
    fetchMock.mockResponseOnce(JSON.stringify(['41', '42', '43']))
    const roomMembers = await peerRoom.join()
    expect(roomMembers).toEqual(['41', '42', '43'])
    expect(peerRoom._roomId).toEqual('8989')
  })
})
