<template lang="pug">
  #app
    CenterEffect

    .effect-banks
      EffectBank(v-for="effect in effects" :effectBank="effect" :key="`${effect.effectType}`")
</template>

<script>
  import { mapState } from 'vuex'
  import EffectBank from './EffectBank'
  import CenterEffect from './CenterEffect'

  export default {
    components: { EffectBank, CenterEffect },

    computed: {
      ...mapState(['effects'])
    }
  }
</script>

<style lang="stylus">
  #app
    margin: 2em
    font-family: 'Poppins', sans-serif

  .effect-banks
    display: flex
  
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