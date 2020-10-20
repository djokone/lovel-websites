import { Color } from 'tns-core-modules/color'

export const feedbacksText = {
  ChangePassword: {
    errors: [
      {
        key: 'Network error (such as timeout, interrupted connection or unreachable host) has occurred.',
        value: {
          title: 'Hors ligne',
          message: 'Il vous faut être connecté à internet pour changer de mot de passe'
        }
      },
      {
        key: 'Changing a password requires an email and an oldPassword and a newPassword arguments',
        value: {
          title: 'Changement de mot de passe',
          message: 'Veuillez entrer les informations necessaire pour changer votre mot de passe'
        }
      }
    ]
  }
}
export const defaultValue = {
  value: {
    duration: 3000
  },
  errors: {
    backgroundColor: new Color('#FF2F38')
  }
}
export function getText (process, key, type = 'errors', toMerge = {}) {
  const value = {
    title: type,
    message: key
  }
  let base = defaultValue.value
  try {
    base = Object.assign(defaultValue.value, defaultValue[type])
  } catch (e) {
  }
  try {
    const feed = feedbacksText[process][type].find(feed => feed.key === key)
    return Object.assign(base, value, feed.value)
  } catch (e) {
    return Object.assign(base, value, toMerge)
  }
}
