class IdSysteme {
  constructor () {
    this.state = {
      id: 0
    }
  }

  addId () {
    return this.state.id ++
  }
}

let idSysteme = new IdSysteme()
export default idSysteme
