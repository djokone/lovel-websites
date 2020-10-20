
export const addInteretSchema = [
  {
    type: 'input',
    label: 'Nom du centre d\'interet',
    model: 'name',
    min: 6,
    inputType: 'text'
  },
  {
    type: 'select',
    label: 'interet',
    model: 'parent_id',
    values: []
  }
]
