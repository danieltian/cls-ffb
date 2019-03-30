<template lang="pug">
  .center-effect
    .header Center Effect

    .body
      .section
        .title Position
        .axis
          .box
            .ball(:style="axisPosition")
          
          table
            tr
              td.label X:
              td.value {{ axisPercentY.toFixed(1) }}%
            tr
              td.label Y:
              td.value {{ axisPercentX.toFixed(1) }}%

      .section
        .title Strength
        .strength
          .label X:
          progress.progress(:value="springEffect.X.positiveCoefficient" max="10000")
          .percent {{ strengthPercentX.toFixed(1) }}%
        .strength
          .label Y:
          progress.progress(:value="springEffect.Y.positiveCoefficient" max="10000")
          .percent {{ strengthPercentY.toFixed(1) }}%

      .section
        .show-debug-button(:class="{ active: isDebugVisible }" @click="toggleDebug")
          span Show Debug
          i.material-icons.caret expand_more

        .debug(v-if="isDebugVisible")
          .label X:
          table
            tr
              td Center Point Offset:
              td {{ springEffect.X.centerPointOffset }}
            tr
              td Positive Coefficient:
              td {{ springEffect.X.positiveCoefficient }}
            tr
              td Negative Coefficient:
              td {{ springEffect.X.negativeCoefficient }}
            tr
              td Positive Saturation:
              td {{ springEffect.X.positiveSaturation }}
            tr
              td Negative Saturation:
              td {{ springEffect.X.negativeSaturation }}
            tr
              td Dead Band:
              td {{ springEffect.X.deadBand }}

          .label Y:
          table
            tr
              td Center Point Offset:
              td {{ springEffect.Y.centerPointOffset }}
            tr
              td Positive Coefficient:
              td {{ springEffect.Y.positiveCoefficient }}
            tr
              td Negative Coefficient:
              td {{ springEffect.Y.negativeCoefficient }}
            tr
              td Positive Saturation:
              td {{ springEffect.Y.positiveSaturation }}
            tr
              td Negative Saturation:
              td {{ springEffect.Y.negativeSaturation }}
            tr
              td Dead Band:
              td {{ springEffect.Y.deadBand }}
</template>

<script>
  import { mapState } from 'vuex'
  const MAX_VALUE = 10000

  export default {
    data() {
      return {
        isDebugVisible: false
      }
    },

    computed: {
      ...mapState(['springEffect']),

      axisPosition() {
        let percentX = this.axisPercentX
        let percentY = this.axisPercentY

        return {
          left: (50 + percentX / 2) + '%',
          top: (50 + percentY / 2) + '%'
        }
      },

      axisPercentX() {
        return this.getPercent(this.springEffect.X.centerPointOffset)
      },

      axisPercentY() {
        return this.getPercent(this.springEffect.Y.centerPointOffset)
      },

      strengthPercentX() {
        return this.getPercent(this.springEffect.X.positiveCoefficient)
      },

      strengthPercentY() {
        return this.getPercent(this.springEffect.Y.positiveCoefficient)
      }
    },

    methods: {
      getPercent(value) {
        let percent = (value / MAX_VALUE * 100)
        return percent
      },

      toggleDebug() {
        this.isDebugVisible = !this.isDebugVisible
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .center-effect
    box-shadow: 0 1px 2px 0 rgba(34, 36, 38, .15)
    display: inline-block
  
  .header
    text-align: center
    background-color: #209CEE
    color: white
    padding: 0.2em 0
    border-top-left-radius: 0.2em
    border-top-right-radius: 0.2em

  .body
    padding: 0.5em 1em
    border: 1px solid rgba(34, 36, 38, .15)
    border-bottom-left-radius: 0.2em
    border-bottom-right-radius: 0.2em

  .section
    margin-bottom: 1em

    &:last-child
      margin-bottom: 0

  .title
    margin-bottom: 0.2em

  .axis
    display: flex

    table
      margin-left: 0.8em

    td
      padding: 0 0.2em

    .label
      font-weight: bold

    .value
      text-align: right

  // Box for the axis visualizer.
  .box
    position: relative
    width: 7em
    height: @width
    border: 0.05em solid #0B619A
    background-color: #F9FCFF
    background-image: linear-gradient(to right, #89ACC4 1px, transparent 1px), linear-gradient(to bottom, #89ACC4 1px, transparent 1px);
    background-position: (@height / 2) (@width / 2)
    border-radius: 0.1em
  
  // Ball inside the axis visualizer.
  .ball
    position: absolute
    width: 0.5em
    height: @width
    background-color: #209CEE
    border: 0.1em solid #0B619A
    border-radius: 0.2em
    transform: translate(-50%, -50%)

  .progress
    -webkit-appearance: none

    &::-webkit-progress-bar
      background-color: #DBDBDB
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset
    
    &::-webkit-progress-value
      background-color: #209CEE
      box-shadow: 0 2px 5px rgba(0,0,0,0.25) inset

  .strength
    display: flex
    align-items: center

    .label
      margin-right: 0.5em
      font-weight: bold
    
    progress
      height: 0.7em
    
    .percent
      margin-left: 0.5em
      width: 3em

  .show-debug-button
    display: flex
    align-items: center
    font-size: 0.8em
    color: #7CC5F6
    cursor: pointer
    user-select: none

    &:hover
      color: #209CEE

    .caret
      font-size: 22px
      transform: rotate(-90deg)
      transition: transform 70ms ease-out
    
    &.active .caret
      transform: none

  .debug
    .label
      font-weight: bold
      margin-top: 0.5em

    table
      font-size: 0.8em

    td
      padding: 0 0.5em 0 0

      &:last-child
        text-align: right
</style>