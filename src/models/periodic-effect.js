class PeriodicEffect {
  constructor() {
    this.magnitude = 0
    this.offset = 0
    this.phase = 0
    this.period = 0
    this.isActive = true
  }

  update(properties) {
    this.magnitude = properties.magnitude
    this.offset = properties.offset
    this.phase = properties.phase
    this.period = properties.period
    this.isActive = true
  }

  getDebugData() {
    return {
      'Magnitude': this.magnitude,
      'Offset': this.offset,
      'Phase': this.phase,
      'Period': this.period
    }
  }
}

export default PeriodicEffect