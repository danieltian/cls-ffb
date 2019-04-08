<template lang="pug">
  .debug
    .toggle-button(:class="{ active: isDebugVisible }" @click="toggleDebug")
      span Debug
      i.material-icons.caret expand_more

    table(v-if="isDebugVisible")
      tr(v-for="key in keys")
        td {{ key }}:
        td {{ debugData[key] }}
</template>

<script>
  export default {
    props: {
      object: { type: Object, required: true }
    },

    data() {
      return {
        isDebugVisible: true
      }
    },

    computed: {
      debugData() {
        return this.object.getDebugData()
      },

      keys() {
        return Object.keys(this.debugData)
      }
    },

    methods: {
      toggleDebug() {
        this.isDebugVisible = !this.isDebugVisible
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .toggle-button
    display: inline-flex
    align-items: center
    font-size: 0.8em
    color: $primary-color
    cursor: pointer
    user-select: none
    opacity: 0.5

    &:hover
      opacity: 1.0

    .caret
      font-size: 22px
      transform: rotate(-90deg)
      transition: transform 70ms ease-out
    
    &.active .caret
      transform: none

  table
    font-size: 0.8em

  td
    padding: 0 0.5em 0 0

    &:last-child
      text-align: right
</style>