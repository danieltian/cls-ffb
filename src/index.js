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
    periodicEffect: new PeriodicEffect(),
    vJoyID: 1,
    port: 5000,
    log: []
  },

  mutations: {
    updateSpringEffectAxis(state, message) {
      state.springEffect.update(message)
    },

    updatePeriodicEffect(state, message) {
      state.periodicEffect.update(message)
    },

    startSpringEffect(state) {
      state.springEffect.start()
    },

    startPeriodicEffect(state) {
      state.periodicEffect.start()
    },

    stopSpringEffect(state) {
      state.springEffect.stop()
    },

    stopPeriodicEffect(state) {
      state.periodicEffect.stop()
    },

    addLogEntry(state, message) {
      let log = state.log
      log.push(message)

      if (log.length >= 1000) {
        log.splice(0, 1)
      }
    },

    stopAllEffects(state) {
      state.springEffect.stop()
      state.periodicEffect.stop()
    },

    setGlobalDeviceGain(state, value) {
      state.globalDeviceGain = value
    }
  }
})

const dgram = remote.require('dgram')
const server = dgram.createSocket({ type: 'udp4', reuseAddr: true })
const { spawn, exec } = remote.require('child_process')

function processMessage(message) {
  if (message.type == 'Feeder Status') {
    store.commit('addLogEntry', message.message)
  }
  else if (message.type == 'Create New Effect Report') {
    console.log('create new effect', message)
    store.commit('addLogEntry', JSON.stringify(message))
  }
  else if (message.type == 'Condition Report') {
    // If the message has the property 'deadBand', assume that this is a spring force update.
    if (message.hasOwnProperty('deadBand')) {
      store.commit('updateSpringEffectAxis', message)
    }
    else {
      console.log('unknown message type', message)
      store.commit('addLogEntry', 'unknown message type: ' + JSON.stringify(message))
    }
  }
  // Assume this is for constant force.
  else if (message.type == 'Constant Force Report') {
    console.log('constant force', message)
    store.commit('addLogEntry', 'constant force: ' + JSON.stringify(message))
  }
  // Assume this is for a periodic square force.
  else if (message.type == 'Periodic Report') {
    store.commit('updatePeriodicEffect', message)
  }
  else if (message.type == 'Effect Operation Report') {
    if (message.effectOperation == 'Effect Start') {
      store.commit('startSpringEffect')
      store.commit('startPeriodicEffect')
      store.commit('addLogEntry', 'starting spring and periodic effect')
    }
    else if (message.effectOperation == 'Effect Stop') {
      store.commit('stopPeriodicEffect')
      store.commit('addLogEntry', 'stopping periodic effect')
    }
    else {
      store.commit('addLogEntry', 'effect operation report: ' + JSON.stringify(message))
    }
  }
  else if (message.type == 'PID Device Control') {
    if (message.deviceControl == 'Device Reset') {
      store.commit('stopAllEffects')
      store.commit('addLogEntry', 'Device reset.')
    }
    else if (message.deviceControl == 'Stop All Effects') {
      store.commit('stopAllEffects')
      store.commit('addLogEntry', 'All effects stopped.')
    }
    else {
      store.commit('addLogEntry', 'PID device control: ' + JSON.stringify(message))
    }
  }
  else if (message.type == 'Device Gain Report') {
    store.commit('addLogEntry', 'Global device gain: ' + JSON.stringify(message))
    store.commit('setGlobalDeviceGain', message.globalDeviceGain)
  }
  else {
    console.log('unknown', message)
  }
}

server.bind(store.state.port)
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

exec(`.\\vJoyUdpFeeder\\vJoyUdpFeeder\\bin\\x64\\Release\\vJoyUdpFeeder 0 ${store.state.port} ${store.state.vJoyID}`)