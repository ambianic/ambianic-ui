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
  AMBIANIC_PNP_SECURE: true // false
}
