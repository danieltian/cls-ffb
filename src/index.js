import Vue from 'vue'
import Vuex from 'vuex'
import App from './components/App'
import { remote } from 'electron'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    globalDeviceGain: 0,
    effects: [],
    springEffect: {
      X: {
        centerPointOffset: 0,
        positiveCoefficient: 0,
        negativeCoefficient: 0,
        positiveSaturation: 0,
        negativeSaturation: 0,
        deadBand: 0
      },
      Y: {
        centerPointOffset: 0,
        positiveCoefficient: 0,
        negativeCoefficient: 0,
        positiveSaturation: 0,
        negativeSaturation: 0,
        deadBand: 0
      }
    }
  },

  mutations: {
    setSpringEffectAxis(state, message) {
      let axis = state.springEffect[message.axis]
      axis.centerPointOffset = message.centerPointOffset
      axis.positiveCoefficient = message.positiveCoefficient
      axis.negativeCoefficient = message.negativeCoefficient
      axis.positiveSaturation = message.positiveSaturation
      axis.negativeSaturation = message.negativeSaturation
      axis.deadBand = message.deadBand
    },

    processMessage(state, message) {
      if (message.type == 'Create New Effect Report') {
        // Ignore this for now.
      }
      // Assume this is for spring force.
      else if (message.type == 'Condition Report') {
        if (message.hasOwnProperty('deadBand')) {
          store.commit('setSpringEffectAxis', message)
        }
        else {
          console.log('unknown message type', message)
        }
      }
      // Assume this is for constant force.
      else if (message.type == 'Constant Force Report') {
        let effect = state.effects.find((x) => x.effectType == 'Constant Force')

        if (!effect) {
          console.log('creating constant force effect')
          effect = { effectType: 'Constant Force' }
          state.effects.push(effect)
        }

        Object.assign(effect, message)
      }
      // Assume this is for a periodic square force.
      else if (message.type == 'Periodic Report') {
        let effect = state.effects.find((x) => x.effectType == 'Square')

        if (!effect) {
          console.log('creating square effect')
          effect = {
            effectType: 'Square',
            magnitude: 0,
            offset: 0,
            phase: 0,
            period: 0
          }
          
          state.effects.push(effect)
        }

        Object.assign(effect, message)
      }
      else if (message.type == 'Effect Operation Report') {
        if (message.effectOperation == 'Effect Stop') {
          // Stop only the periodic square effect.
          let effect = state.effects.find((x) => x.effectType == 'Square')

          if (effect) {
            let index = state.effects.indexOf(effect)
            console.log('effect stop, stopping square effect, index is ', index)
            state.effects.splice(index, 1)
          }
        }
      }
      else if (message.type == 'PID Device Control') {
        if (message.deviceControl == 'Device Reset') {
          state.effects = []
        }
        else if (message.deviceControl == 'Stop All Effects') {
          state.effects = []
        }
      }
      else if (message.type == 'Device Gain Report') {
        state.globalDeviceGain = message.globalDeviceGain
      }
    }
  }
})

const dgram = remote.require('dgram')
const server = dgram.createSocket({
  type: 'udp4',
  reuseAddr: true
})

server.bind(5000)
server.on('message', (message) => {
  const data = JSON.parse(message.toString())
  store.commit('processMessage', data)
})

new Vue({
  el: '#app',
  store,
  render: (h) => h(App)
})