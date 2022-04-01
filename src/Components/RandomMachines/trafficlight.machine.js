const { createMachine, assign } = require('xstate');

const trafficMachine = createMachine({
  id: 'traffic',
  initial: 'red',
  context: { rushHourMultiplier: 1},
  on: {
    INC_RUSH_MLT: {
      actions: ['incrementRushHourMutliplier']
    }
  },
  states: {
    red: {
      after: {
        red_timer: 'yellow'
      }
    },
    yellow: {
      after: {
        yellow_timer: 'green'
      }
    },
    green: {
      after: {
        green_timer: 'red'
      }
    },
  }
},{
  actions: {
    incrementRushHourMutliplier: assign({rushHourMultiplier: (context) => context.rushHourMultiplier + 1})
  },
  delays: {
    red_timer: context => context.rushHourMultiplier * 2000,
    yellow_timer: context => context.rushHourMultiplier * 1000,
    green_timer: context => context.rushHourMultiplier * 3000,
  }
})