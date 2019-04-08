<template lang="pug">
  .panel
    .header Periodic Effect

    .body
      .section
        PercentBar(label="Magnitude" :value="periodicEffect.magnitude" :max="10000")
      
      .section
        .period
          span.label Period:
          span.value &nbsp;{{ periodicEffect.period }}ms

      Debug(:object="periodicEffect")
</template>

<script>
  import { mapState } from 'vuex'
  import PercentBar from './PercentBar'
  import Debug from './Debug'

  export default {
    components: { PercentBar, Debug },

    computed: {
      ...mapState(['periodicEffect'])
    }
  }
</script>

<style lang="stylus" scoped>


  .label
    font-weight: bold
</style>