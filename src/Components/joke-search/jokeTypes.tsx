import { EventObject } from "xstate";

export type TypeEvent = { type: 'TYPE', value: string };
type SearchEvent = { type: 'SEARCH' };
export type JokesEvent = TypeEvent | SearchEvent | EventObject;

export type JokesContext = {
  input: string,
  results: Joke[],
  error?: string
};

export type JokesState = 
{ value: 'ready', context: JokesContext}
| { value: 'searching', context: JokesContext}
| { value: 'error', context: JokesContext & { error: string}};

export interface Joke {
  id: string;
  value: string;
}