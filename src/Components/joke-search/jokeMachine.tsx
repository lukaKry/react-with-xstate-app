import { createMachine, assign, DoneInvokeEvent, StateMachine } from "xstate";
import { JokesContext, JokesEvent, JokesState, Joke, TypeEvent } from "./jokeTypes";

const jokeBaseUrl = `https://api.chucknorris.io/jokes/search?query=`;

export const fetchJoke = async (input: string): Promise<Joke[]> => {
  const response = await fetch(
    jokeBaseUrl + input,
    { headers: {Accept: 'application/json'}}
  );
  return response.json();
};

const readyState = {
  on: { 
    SEARCH: 'searching'
  }
};

const errorState = {
  on: { 
    SEARCH: 'searching',
    TYPE: 'ready'
  }
};

const searchingState = {
  invoke: {
    id: 'fetchJokes',
    src: (context: JokesContext): Promise<Joke[]> => fetchJoke(context.input),
    onDone: {
      target: 'ready',
      actions: assign<JokesContext, DoneInvokeEvent<{ result: Joke[] }>>({
        results: (context, event) => event.data.result.splice(0,5)
      })
    },
    onError: {
      target: 'error',
      actions: assign<JokesContext, DoneInvokeEvent<Error>>({
        error: (context, event) => event.data.message
      })
    },
  }
}


export const jokesMachine: StateMachine<JokesContext, JokesState, JokesEvent> = createMachine(
  {
    id: 'jokesMachine',
    initial: 'ready',
    context: { input: '', results: [] as Joke[]},
    states: 
      {
        ready: readyState,
        error: errorState,
        searching: searchingState,
      },
    on: {
      TYPE: {
        actions: 'typing'
      }
    }
  },
  {
    actions: {
      typing: assign((context, e) => ({ input: (e as TypeEvent).value}))
    }
  }
);

