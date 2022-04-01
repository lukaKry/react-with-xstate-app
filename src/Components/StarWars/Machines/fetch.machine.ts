import { createMachine, assign } from 'xstate';

type FetchStates = 
| { value: 'idle', context: FetchContext}
| { value: 'pending', context: FetchContext}
| { value: 'successful', context: FetchContext}
| { value: 'failed', context: FetchContext}

type FetchMachineEvent = { type: 'FETCH' }
type ResolveMachineEvent = { type: 'RESOLVE', results: [] }
type RejectMachineEvent = { type: 'REJECT', message: string }

type FetchMachineEvents = 
| FetchMachineEvent
| ResolveMachineEvent
| RejectMachineEvent;

interface FetchContext {
  results: [];
  message: string;
}

export const fetchMachine = 
createMachine<
  FetchContext,
  FetchMachineEvents,
  FetchStates
  >({
  context: {
    results: [],
    message: '',
  },
  id: "fetch",
  initial: "idle",
  states: {
    idle: {
      on: {
        FETCH: {
          target: "pending",
        },
      },
    },
    pending: {
      entry: ["fetchData"],
      on: {
        RESOLVE: {
          actions: ["setResult"],
          target: "successful",
        },
        REJECT: {
          actions: ["setMessage"],
          target: "failed",
        },
      },
    },
    failed: {
      on: {
        FETCH: {
          target: "pending",
        },
      },
    },
    successful: {
      on: {
        FETCH: {
          target: "pending",
        },
      },
    },
  },
}, {
  actions: {
    setResult: assign<FetchContext, FetchMachineEvents>({results: (context, event) => (event as ResolveMachineEvent).results, message: ''}),
    // setMessage: assign({message: (context, event: RejectMachineEvent) => event.message}),
    setMessage: assign<FetchContext, FetchMachineEvents>({message: (context, event) => (event as RejectMachineEvent).message, results: []}),
    // setResult: (context, event) => assign({results: event.results}),
    // setMessage: (context, event) => assign({message: event.message}),
  }
});


