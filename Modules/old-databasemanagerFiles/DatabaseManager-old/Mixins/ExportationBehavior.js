const ExportationBehavior = {
  data () {
    return {
      ExportationBehavior: {
        selection: [],
        selectionMode: 0,
        isExport: false
      }
    }
  },
  created () {
    console.log('active Exportation Behavior')
  },
  computed: {
    isAllMode () {
      return this.ExportationBehavior.selectionMode === 0 && this.ExportationBehavior.isExport
    },
    isSelectionMode () {
      return this.ExportationBehavior.selectionMode === 1 && this.ExportationBehavior.isExport
    }
  },
  methods: {
    toogleExport () {
      this.ExportationBehavior.isExport = !this.ExportationBehavior.isExport
    },
    onChangeSelectionMode (indexMode) {
      this.ExportationBehavior.selectionMode = indexMode
    },
    onChangeSelection (selection) {
      this.ExportationBehavior.selection = selection
    }
  }
}
export default ExportationBehavior
