import Vue from 'vue'
import Vuex from 'vuex'
import App from './components/App'
import { remote } from 'electron'
import SpringEffect from './models/spring-effect'
import PeriodicEffect from './models/periodic-effect'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    globalDeviceGain: 0,
    effects: [],
    springEffect: new SpringEffect(),
    periodicEffect: new PeriodicEffect()
  },

  mutations: {
    updateSpringEffectAxis(state, message) {
      state.springEffect.update(message)
    },

    updatePeriodicEffect(state, message) {
      state.periodicEffect.update(message)
    }
  }
})

const dgram = remote.require('dgram')
const server = dgram.createSocket({ type: 'udp4', reuseAddr: true })

function processMessage(message) {
  if (message.type == 'Create New Effect Report') {
    console.log('create new effect', message)
  }
  // Assume this is for spring force.
  else if (message.type == 'Condition Report') {
    if (message.hasOwnProperty('deadBand')) {
      store.commit('updateSpringEffectAxis', message)
    }
    else {
      console.log('unknown message type', message)
    }
  }
  // Assume this is for constant force.
  else if (message.type == 'Constant Force Report') {
    console.log('constant force', message)
    // let effect = state.effects.find((x) => x.effectType == 'Constant Force')

    // if (!effect) {
    //   console.log('creating constant force effect')
    //   effect = { effectType: 'Constant Force' }
    //   state.effects.push(effect)
    // }

    // Object.assign(effect, message)
  }
  // Assume this is for a periodic square force.
  else if (message.type == 'Periodic Report') {
    store.commit('updatePeriodicEffect', message)
  }
  else if (message.type == 'Effect Operation Report') {
    console.log('effect operation', message)
    // if (message.effectOperation == 'Effect Stop') {
    //   // Stop only the periodic square effect.
    //   let effect = state.effects.find((x) => x.effectType == 'Square')

    //   if (effect) {
    //     let index = state.effects.indexOf(effect)
    //     console.log('effect stop, stopping square effect, index is ', index)
    //     state.effects.splice(index, 1)
    //   }
    // }
  }
  else if (message.type == 'PID Device Control') {
    console.log('pid device control', message)
    // if (message.deviceControl == 'Device Reset') {
    //   state.effects = []
    // }
    // else if (message.deviceControl == 'Stop All Effects') {
    //   state.effects = []
    // }
  }
  else if (message.type == 'Device Gain Report') {
    console.log('device gain', message)
    state.globalDeviceGain = message.globalDeviceGain
  }
  else {
    console.log('unknown', message)
  }
}

server.bind(5000)
server.on('message', (message) => {
  // Message is a Uint8 array, toString() will convert it to a char string.
  const data = JSON.parse(message.toString())
  processMessage(data)
})

window.addEventListener('beforeunload', () => {
  server.close()
})

new Vue({
  el: '#app',
  store,
  render: (h) => h(App)
})