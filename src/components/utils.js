export const PEER_CONNECTING_NOTIFICATION = 'Connecting to Ambianic Edge device'
export const PEER_CONNECTED_NOTIFICATION = 'Connected to Ambianic Edge device'
export const PEER_DISCONNECTED_NOTIFICATION = 'Disconnected from Ambianic Edge device'

export const setTimelineEventIcon = (inf) => {
  let topLabel = 'none'

  if (inf.length > 0) {
    topLabel = inf[0].label
  }
  let icon = 'mdi-crosshairs-question'
  switch (topLabel) {
    case 'person':
      icon = 'mdi-human'
      break
    case 'face':
      icon = 'mdi-face'
      break
    case 'car':
      icon = 'mdi-car'
      break
    case 'cat':
      icon = 'mdi-cat'
      break
    case 'dog':
      icon = 'mdi-dog'
      break
  }
  return icon
}

export const setTimelineEventColor = (priority) => {
  let color = 'primary'

  switch (priority) {
    case 'INFO':
      color = 'accent'
      break
    case 'WARNING':
      color = 'warning'
      break
    case 'CRITICAL':
      color = 'error'
      break
  }
  color = 'white--text ' + color + ' lighten-2'
  return color
}
