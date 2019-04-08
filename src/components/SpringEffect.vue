<template lang="pug">
  .panel
    .header Spring Effect

    .body
      .section
        .title Center Position
        .axis-info
          .box
            .ball(:style="axisPosition")

          .swap-axes-checkbox
            input(type="checkbox" id="swap-axes" v-model="isAxesSwapped")
            label(for="swap-axes") Swap Axes

          table
            tr
              td.label X:
              td.value {{ axisPercentX.toFixed(1) }}%
            tr
              td.label Y:
              td.value {{ axisPercentY.toFixed(1) }}%

      .section
        .title Strength
        PercentBar(label="X" :value="springEffect.X.positiveCoefficient" :max="10000")
        PercentBar(label="Y" :value="springEffect.Y.positiveCoefficient" :max="10000")

      Debug(:object="springEffect")
</template>

<script>
  import { mapState } from 'vuex'
  import PercentBar from './PercentBar'
  import Debug from './Debug'

  export default {
    components: { PercentBar, Debug },

    data() {
      return {
        isAxesSwapped: false
      }
    },

    computed: {
      ...mapState(['springEffect']),

      axisPosition() {
        return {
          left: (50 + this.axisPercentX / 2) + '%',
          top: (50 + this.axisPercentY / 2) + '%'
        }
      },

      axisPercentX() {
        const offset = this.isAxesSwapped ? this.springEffect.Y.centerPointOffset : -(this.springEffect.X.centerPointOffset)
        return this.getPercent(offset)
      },

      axisPercentY() {
        const offset = this.isAxesSwapped ? this.springEffect.X.centerPointOffset : this.springEffect.Y.centerPointOffset
        return this.getPercent(offset)
      }
    },

    methods: {
      getPercent(value) {
        const percent = (value / 10000 * 100)
        return percent
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .axis-info
    display: grid
    grid-template-columns: min-content min-content
    grid-template-rows: min-content 1fr

  // Box for the axis visualizer.
  .box
    grid-row: 1 / 3
    position: relative
    width: 7em
    height: @width
    border: 0.05em solid #0B619A
    background-color: #F9FCFF
    background-image: linear-gradient(to right, #89ACC4 1px, transparent 1px), linear-gradient(to bottom, #89ACC4 1px, transparent 1px);
    background-position: (@height / 2) (@width / 2)
    border-radius: 0.1em
    margin-right: 0.8em
  
  // Ball inside the axis visualizer.
  .ball
    position: absolute
    width: 0.5em
    height: @width
    background-color: $primary-color
    border: 0.1em solid #0B619A
    border-radius: 0.2em
    transform: translate(-47%, -47%) // Needs to be 47% in order to look visually centered.
  
  .swap-axes-checkbox
    font-size: 0.8em
    display: flex
    align-items: center
    margin: 0.2em 0 0.5em 0
    cursor: pointer
    color: $primary-color
    white-space: nowrap

    &:hover
      color: #6FBCEE

    label, input
      cursor: pointer
      

  table
    display: inline-block

  td
    padding: 0 0.2em

  .label
    font-weight: bold

  .value
    text-align: right
</style>