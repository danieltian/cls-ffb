class PeriodicEffect {
  constructor() {
    this.magnitude = 0
    this.offset = 0
    this.phase = 0
    this.period = 0
    this.isActive = false
    this.type = undefined
  }

  update(properties) {
    this.magnitude = properties.magnitude
    this.offset = properties.offset
    this.phase = properties.phase
    this.period = properties.period
  }

  setType(type) {
    this.type = type
  }

  getDebugData() {
    return {
      'Magnitude': this.magnitude,
      'Offset': this.offset,
      'Phase': this.phase,
      'Period': this.period
    }
  }

  start() {
    this.isActive = true
  }

  stop() {
    this.isActive = false
  }
}

export default PeriodicEffect