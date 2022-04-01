const { createMachine, assign } = require('xstate');

const tryMachine = createMachine({
  id: 'try',
  context: { tries: 0 },
  initial: 'idle',
  states: {
    idle: {
      on: {
        TRY: 'trying'
      }
    },
    trying: {
      entry: [ 'incrementTries' ],
      on: {
        '': [
          { target: 'success', cond: ['enoughTries']},
          { target: 'idel'}
        ]
      }
    },
    success: {},
  }
}, {
  actions: {
    incrementTries: assign({tries: (context) => context.tries + 1})
  },
  guards: {
    enoughTries: (context) => context.tries > 2,
  }
})