<template lang="pug">
  #log-viewer
    .header Log Viewer
    textarea.logs {{ logText }}
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState(['log']),

      logText() {
        return this.log.join('\n')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .header
    background-color: #053352
    color: white
    padding: 0.2em 0 0.2em 0.4em
    font-size: 0.9em

  .logs
    resize: none
    font-family: Consolas, Monaco, Lucida Console, monospace
    font-size: 0.8em
    height: 15em
    outline: none
    display: block
    width: 100%
    border: none
    box-sizing: border-box
    padding-left: 0.3em
</style>