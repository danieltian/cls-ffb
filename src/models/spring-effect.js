const axisProperties = {
  centerPointOffset: 0,
  positiveCoefficient: 0,
  negativeCoefficient: 0,
  positiveSaturation: 0,
  negativeSaturation: 0,
  deadBand: 0
}

class SpringEffect {
  constructor() {
    this.X = Object.assign({}, axisProperties)
    this.Y = Object.assign({}, axisProperties)
    this.isActive = false
  }

  update(properties) {
    const axis = this[properties.axis]
    axis.centerPointOffset = properties.centerPointOffset
    axis.positiveCoefficient = properties.positiveCoefficient
    axis.negativeCoefficient = properties.negativeCoefficient
    axis.positiveSaturation = properties.positiveSaturation
    axis.negativeSaturation = properties.negativeSaturation
    axis.deadBand = properties.deadBand
    this.isActive = true
  }

  getDebugData() {
    return {
      'X - Center Point Offset': this.X.centerPointOffset,
      'X - Positive Coefficient': this.X.positiveCoefficient,
      'X - Negative Coefficient': this.X.negativeCoefficient,
      'X - Positive Saturation': this.X.positiveSaturation,
      'X - Negative Saturation': this.X.negativeSaturation,
      'X - Dead Band': this.X.deadBand,
      'Y - Center Point Offset': this.Y.centerPointOffset,
      'Y - Positive Coefficient': this.Y.positiveCoefficient,
      'Y - Negative Coefficient': this.Y.negativeCoefficient,
      'Y - Positive Saturation': this.Y.positiveSaturation,
      'Y - Negative Saturation': this.Y.negativeSaturation,
      'Y - Dead Band': this.Y.deadBand
    }
  }
}

export default SpringEffect