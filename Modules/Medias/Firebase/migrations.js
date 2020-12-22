const admin = require('firebase-admin')
const bucket = admin.storage().bucket();
const {Storage} = require('@google-cloud/storage')
const gcs = new Storage()
const bucketName = bucket.name;
const db = admin.firestore()
const gcsDefaultBucket = gcs.bucket(bucketName)

async function thisFileExist(storage_path) {
  const storageFile = gcsDefaultBucket.file(storage_path)
  let fileExist = await storageFile.exists()
  fileExist = fileExist[0]
  return fileExist[0]
}

const validators = {
  async isNumber(field, media) {
    return typeof media[field] === 'number'
  },
  async isDate(field, media) {
    return typeof media[field].toDate === 'function' && Date.parse(media[field].toDate())
  },
  async notEmpty(field, media) {
    return media[field] !== ''
  },
  async isId(field, media) {
    return true
  }
}

const MediaSchema = {
  created: {
    required: true,
    default() {
      return admin.firestore.FieldValue.serverTimestamp()
    },
    validations: [
      {
        msg: 'Need to be a date',
        validators: ['isDate']
      }
    ]
  },
  index: {
    required: true,
    validations: [
      {
        msg: 'Need to be a number',
        validators: ['isNumber']
      }
    ]
  },
  ref: {
    required: true,
    validations: [
      {
        msg: 'Need to be a date',
        validators: ['notEmpty']
      },
      {
        msg: 'User document doesn\'t exist',
        async validate(field, media) {
          if (media.ref === 'users') {
            const doc = await db.collection(media.ref).doc(media.ref_id).get()
            return doc.exists
          } else {
            return true
          }
        }
      },
      {
        msg: 'Interaction document doesn\'t exist',
        async validate(field, media) {
          if (media.ref === 'interactions') {
            const doc = await db.collection(media.ref).doc(media.ref_id).get()
            return doc.exists
          } else {
            return true
          }
        }
      }
    ]
  },
  storage_path: {
    required: true,
    validations: [
      {
        msg: 'No file in storage',
        async validate(field, media) {
          const storageFile = gcsDefaultBucket.file(media.storage_path)
          let fileExist = await storageFile.exists()
          return fileExist[0]
        }
      }
    ]
  },
  created_user_id: {
    validations: [
      {
        msg: 'Is not an Id',
        validators: ['isId']
      }
    ]
  }
}

/**
 *
 * @param media
 * @param MediaSchema
 * @returns {Promise<{isUp: *, isValid: boolean}>}
 */
async function checkMediaWithSchema(media, MediaSchema) {
  let check = {
    isValid: true,
    media,
    warnings: [],
    errors: []
  }
  const fields = Object.keys(MediaSchema)

  // return an array of field not present in data but required
  const checkRequiredFields = fields.filter((field) => {
    return MediaSchema[field].required && typeof media[field] === 'undefined'
  })
  if (checkRequiredFields.length) {

    check.errors = [...check.errors, ...checkRequiredFields.map((field) => {
      return {
        field,
        msg: `${field} is required but not present`
      }
    })]
  }

  // Filter field alread
  for (const field of fields) {
    const fieldSchema = MediaSchema[field]
    const validations = fieldSchema.validations
    let errors = []
    if (validations && validations.length) {
      // console.log(`${validations.length} validation rules`)
      let validationErrors = []
      for (const validation of validations) {
        let valid = true
        if (validation.validators && validation.validators.length) {
          for (const validator of validation.validators) {
            valid = await runValidatorToField(validator, field, media, validation)
          }
        }
        if (typeof validation.validate === 'function') {
          valid = valid && await validation.validate(field, media, validation)
        }
        if (!valid) {
          validationErrors.push({
            field,
            msg: validation.msg
          })
        }
      }
      errors = [...errors, ...validationErrors]
    } else {
      console.log(`No validations founded for ${field}`)
    }
    check.errors = [...check.errors, ...errors]
  }
  check.isValid = !check.errors.length
  return check
}

async function runValidatorToField(validator, field, media, validation) {
  if (typeof validators[validator] === 'function') {
    try {
      return await validators[validator](field, media, validation)
    } catch (e) {
      throw `Error during ${validator} validation of ${field} field\n ${e}`
    }
  } else {
    throw `Error: ${validator} Validator's missing for ${field} field`
  }
}

/**
 * @todo load automatically migrations here with a conventional migrations files name
 * File name convention : .../Firebase/migration_2_0_0.js
 * @type {{isUp(*): *, up(*): {storage_path: *}, version: string, down(*): {storage_path: *}}}
 */
const v2_0_0 = {
  version: '2.0.0',
  fromVersion: '1.9.9',
  async check(media) {
    return {
      media,
      checkSchema: await checkMediaWithSchema(media, MediaSchema),
      isUp: this.isUp(media)
    }
  },
  up(media) {
    return {
      storage_path: media.storage_path.replace(/([1-9])_/, '@p$&')
    }
  },
  down(media) {
    return {
      storage_path: media.storage_path.replace(/(@p)[1-9]_/, '')
    }
  },
  isUp(media) {
    return media.storage_path.includes('@p')
  }
}

const migrations = [
  v2_0_0
]

module.exports.migrations = migrations
