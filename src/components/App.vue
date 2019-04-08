<template lang="pug">
  #app
    Header

    .main-content
      .effects
        SpringEffect.effect(v-if="springEffect")
        PeriodicEffect.effect(v-if="periodicEffect")

      .effect-banks
        EffectBank(v-for="effect in effects" :effectBank="effect" :key="`${effect.effectType}`")
</template>

<script>
  import { mapState } from 'vuex'
  import EffectBank from './EffectBank'
  import Header from './Header'
  import SpringEffect from './SpringEffect'
  import PeriodicEffect from './PeriodicEffect'

  export default {
    components: { Header, EffectBank, SpringEffect, PeriodicEffect },

    computed: {
      ...mapState(['effects', 'springEffect', 'periodicEffect'])
    }
  }
</script>

<style lang="stylus">
  @require '../styles/panel'

  html
    height: 100%

  body
    margin: 0
    background-color: #E6E6E6
    font-family: 'Poppins', sans-serif

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