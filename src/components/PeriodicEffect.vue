<template lang="pug">
  Panel(header="Periodic Effect" :active="periodicEffect.isActive")
    .section
      span.label Type:
      span.value &nbsp;{{ periodicEffect.type }}

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
  import Panel from './Panel'
  import PercentBar from './PercentBar'
  import Debug from './Debug'

  export default {
    components: { Panel, PercentBar, Debug },

    computed: {
      ...mapState(['periodicEffect'])
    }
  }
</script>

<style lang="stylus" scoped>


  .label
    font-weight: bold
</style>