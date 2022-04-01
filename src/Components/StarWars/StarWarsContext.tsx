import { useInterpret } from '@xstate/react';
import React, { createContext } from 'react';
import { InterpreterFrom } from 'xstate';
import { fetchMachine } from './Machines/fetch.machine';

export const StarWarsContext = createContext({});

export const StarWarsStateProvider = (props:any) => {
  const starWarsService = useInterpret(fetchMachine);

  return (
    <StarWarsContext.Provider value={{ starWarsService }}>
      {props.children}
    </StarWarsContext.Provider>
  );
}