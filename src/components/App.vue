<template lang="pug">
  #app
    Header

    .main-content
      .effects
        SpringEffect.effect(v-if="springEffect")
        PeriodicEffect.effect(v-if="periodicEffect")

      .effect-banks
        EffectBank(v-for="effect in effects" :effectBank="effect" :key="`${effect.effectType}`")

    LogViewer
</template>

<script>
  import { mapState } from 'vuex'
  import EffectBank from './EffectBank'
  import Header from './Header'
  import SpringEffect from './SpringEffect'
  import PeriodicEffect from './PeriodicEffect'
  import LogViewer from './LogViewer'

  export default {
    components: { Header, EffectBank, SpringEffect, PeriodicEffect, LogViewer },

    computed: {
      ...mapState(['effects', 'springEffect', 'periodicEffect'])
    }
  }
</script>

<style lang="stylus">
  html
    height: 100%

  body
    height: 100%
    margin: 0
    background-color: #eeeeee
    font-family: 'Poppins', sans-serif

  #app
    height: 100%
    display: grid
    grid-template-rows: min-content 1fr min-content

  .main-content
    margin: 2em

  .effects
    display: flex
    align-items: flex-start

  .effect
    margin-right: 1.5em

  .bank
    width: 20em
    height: 15em
    background-color: #dcdcdc
    border: 1px solid #343434
    margin-right: 1em

    &:last-of-type {
      margin-right: 0
    }
</style>