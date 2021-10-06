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

export const ONBOARDING_MESSAGE_CLIENTS = [
  {
    name: 'Email',
    content: `mailto:bob@gmail.com?subject=Ambianic Edge Access Request&body=Bob please send me an access invitation to your Ambianic Edge device.
https://ui.ambianic.ai/share`,
    icon: 'email'
  },
  {
    name: 'SMS Message',
    content: 'sms:&body=Testing%Ambianic%UI',
    icon: 'message-processing'
  },
  {
    name: 'Whatsapp',
    content: 'whatsapp://send?text=Testing%Ambianic%sharing',
    icon: 'whatsapp'
  },
  {
    name: 'iMessage',
    content: '#',
    icon: 'apple'
  }
]

export const validatePeerIdHelper = value => {
  const regexEval = /^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$/.test(value)

  return {
    isCorrectPeerId: regexEval
  }
}
