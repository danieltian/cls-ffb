<template lang="pug">
  .percent-bar
    .label {{ label }}:
    progress(:value="value" max="10000")
    .percent {{ percent }}%
</template>

<script>
  export default {
    props: {
      label: { type: String, required: true },
      value: { type: Number, required: true },
      max: { type: Number, required: true }
    },

    computed: {
      percent() {
        return (this.value / this.max * 100).toFixed(1)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .percent-bar
    display: flex
    align-items: center

  .label
    margin-right: 0.5em
    font-weight: bold

  progress
    -webkit-appearance: none
    height: 0.7em

    &::-webkit-progress-bar
      background-color: #DBDBDB
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset
    
    &::-webkit-progress-value
      background-color: $primary-color
      box-shadow: 0 2px 5px rgba(0,0,0,0.25) inset
  
  .percent
    margin-left: 0.5em
    width: 3em
</style>