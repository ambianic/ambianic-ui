// Ambianic client side configuration
export const ambianicConf = {
  // AMBIANIC_API_URI: 'http://192.168.86.22:8778/api/'
  AMBIANIC_API_FALLBACK_URI: '/sample-data/',
  AMBIANIC_EDGE_API_SCHEMA: 'http', // 'http' or 'https'
  AMBIANIC_EDGE_HOST: 'localhost',
  // AMBIANIC_EDGE_HOST: '8778-orange-hoverfly-61rvl45a.ws-us18.gitpod.io',
  AMBIANIC_EDGE_API_PORT: 8778,
  // AMBIANIC_EDGE_API_PORT: 443,
  AMBIANIC_EDGE_API_ROOT: 'api',
  AMBIANIC_PNP_HOST: 'ambianic-pnp.herokuapp.com', // 'localhost'
  AMBIANIC_PNP_PORT: 443, // 9779
  AMBIANIC_PNP_SECURE: true, // false
  ICE_CONFIG: {
    'iceServers': [
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'stun:stun1.l.google.com:19302' },
      { url: 'stun:stun2.l.google.com:19302' },
      { url: 'stun:stun3.l.google.com:19302' },
      { url: 'stun:stun4.l.google.com:19302' },
      { url: 'turn:numb.viagenie.ca', credential: 'DAEidbG!xHavEX7', username: 'turn@ambianic.ai' },
      {
        "username":"1639539168:prj_2OPKFTM1cuVGO0uq4CmBWa",
        "credential":"BdT+ctWfSdy9h1xqFf/jN1OM5Wc=",
        "url":"turn:globalturn.subspace.com:3478?transport=udp",
        "urls":"turn:globalturn.subspace.com:3478?transport=udp"
      },
      {
        "username":"1639539168:prj_2OPKFTM1cuVGO0uq4CmBWa",
        "credential":"BdT+ctWfSdy9h1xqFf/jN1OM5Wc=",
        "url":"turn:globalturn.subspace.com:3478?transport=tcp",
        "urls":"turn:globalturn.subspace.com:3478?transport=tcp"
      },
      {
        "username":"1639539168:prj_2OPKFTM1cuVGO0uq4CmBWa",
        "credential":"BdT+ctWfSdy9h1xqFf/jN1OM5Wc=",
        "url":"turns:globalturn.subspace.com:5349?transport=udp",
        "urls":"turns:globalturn.subspace.com:5349?transport=udp"
      },
      {
        "username":"1639539168:prj_2OPKFTM1cuVGO0uq4CmBWa",
        "credential":"BdT+ctWfSdy9h1xqFf/jN1OM5Wc=",
        "url":"turns:globalturn.subspace.com:5349?transport=tcp",
        "urls":"turns:globalturn.subspace.com:5349?transport=tcp"
      },
      {
        "username":"1639539168:prj_2OPKFTM1cuVGO0uq4CmBWa",
        "credential":"BdT+ctWfSdy9h1xqFf/jN1OM5Wc=",
        "url":"turns:globalturn.subspace.com:443?transport=tcp",
        "urls":"turns:globalturn.subspace.com:443?transport=tcp"
      }
    ],
    "ttl":86400
  } /* Default STUN and TURN servers */
}
