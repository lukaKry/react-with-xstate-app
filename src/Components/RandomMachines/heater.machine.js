const { createMachine } = require('xstate');

const heaterMachine = createMachine({
  id: 'heater',
  initial: 'power_off',
  states: {
    power_on: {
      on: {
        TOGGLE_POWER: 'power_off'
      },
      type: 'parallel',
      states: {
        heating: {
          initial: 'lowHeat',
          states: {
            lowHeat: {
              on: { TOGGLE_HEAT: 'highHeat' }
            },
            highHeat: {
              on: { TOGGLE_HEAT: 'lowHeat'}
            },
          }
        },
        oscilation: {
          initial: 'oscilationON',
          states: {
            oscilationON: { on: {TOGGLE_OSC: 'oscilationOFF'}},
            oscilationOFF: { on: { TOGLLE_OSC: 'oscilationON'}},
          }
        },
        history: {
          type: 'history',
          history: 'deep'
        }
      },
      
    },
    power_off: {
      on: {
        TOGGLE_POWER: 'power_on.history'
      }
    }
  }
}, {

});