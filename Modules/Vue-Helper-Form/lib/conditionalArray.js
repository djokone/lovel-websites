
export default function conditionalArray (valueToCompare, arrayToCompareWith, operator, type) {
  let isAllow
  type = type || 'or'
  operator = operator || '==='
  arrayToCompareWith.forEach((v, index) => {
    if (index === 0) {
      isAllow = operatorTextToCondition(v, operator, valueToCompare)
    } else {
      if (type === 'and') {
        isAllow && operatorTextToCondition(v, operator, valueToCompare)
      } else {
        isAllow || operatorTextToCondition(v, operator, valueToCompare)
      }
    }
  })
  return isAllow
}

/*eslint-disable */

function operatorTextToCondition (value1, operator, value2) {
  let output
  switch (operator) {
    case '==':
      output = value1 == value2
      break

    case '===':
      output = value1 === value2
      break

    case '!=':
      output = value1 != value2
      break

    case '!==':
      output = value1 !== value2
      break

    case '>':
      output = value1 > value2
      break

    case '>=':
      output = value1 >= value2
      break

    case '<':
      output = value1 < value2
      break

    case '<=':
      output = value1 <= value2
      break

    default:
      console.log('Err : \'' + operator + '\' This operator doesn\'t exist !')
      break
  }
  return output
}
