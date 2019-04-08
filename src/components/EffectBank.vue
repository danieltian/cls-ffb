<template lang="pug">
  table.effect-bank
    tr(v-for="entry in entries")
      td.key {{ entry[0] }}
      td.value {{ entry[1] }}
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props: {
      effectBank: { type: Object, required: true }
    },

    computed: {
      entries() {
        const entries = Object.entries(this.effectBank)
        return entries
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .effect-bank
    margin-right: 2em
    border: 1px solid #343434
    height: 10em

  .key, .value
    font-family: Arial, Helvetica, sans-serif

  .key
    font-weight: bold
    padding-right: 1em
</style>