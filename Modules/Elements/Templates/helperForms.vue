<script>
  function createFormContainer (h, instance) {
    return {
    }
  }

  export default ({
    render (h) {
      return h(
        'form',

      )
    },
    renderError (h, err) {
      return h('pre', { style: { color: 'red' }}, err.stack)
    }
  })
</script>