const { createMachine, assign } = require('xstate');

const url = 'https://api.chucknorris.io/jokes/random';

const fetchPromise = () => {
  return fetch(url).then(response => response.json()).then(data =>  data);
}

const promiseMachine = createMachine({
  id: 'promise',
  context: { data: '', error: '' },
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'fetching'
      }
    },
    fetching: {
      invoke: {
        id: 'fetch',
        src: fetchPromise,
        onDone: { target: 'success', actions: assign({data: (context, event) => event.data})},
        onError: { target: 'failure', actions: assign({error: (context, event) => event.data})}
      }
    },
    failure: {
      on: {
        RETRY: 'fetching'
      }
    },
    success: {
      type: 'final'
    },
  }
},{

});