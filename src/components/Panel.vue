<template lang="pug" functional>
  .panel(:class="{ active: props.active }")
    .header
      .text {{ props.header }}
      i.icon.fas.fa-play-circle(v-if="props.active")
      i.icon.fas.fa-pause-circle(v-else)

    .body
      slot
</template>

<style lang="stylus" scoped>
  $panel-border-radius = 0.2em

  .panel
    box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15)

    .header
      text-align: center
      background-color: #d31420
      color: white
      padding: 0.2em 0
      border-top-left-radius: $panel-border-radius
      border-top-right-radius: $panel-border-radius
      position: relative

      .icon
        position: absolute
        top: 50%
        transform: translateY(-50%)
        right: 0.7em
        font-size: 0.8em

    &.active .header
      background-color: #1486d3

    .body
      padding: 0.5em 1em
      background-color: white
      border: 1px solid rgba(34, 36, 38, 0.15)
      border-bottom-left-radius: $panel-border-radius
      border-bottom-right-radius: $panel-border-radius
</style>

<style lang="stylus">
  .panel .body
    .section
      margin-bottom: 1em

      &:last-child
        margin-bottom: 0

    .title
      margin-bottom: 0.3em
</style>