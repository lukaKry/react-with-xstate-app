import { useMachine } from '@xstate/react'
import LibraryContext from './LibraryContext';
import LibraryDesktop from './LibraryDesktop';
import LibraryLogin from './LibraryLogin';
import { libraryMachine } from './libraryMachine'


export default function Library() {
  const [machine, send] = useMachine(libraryMachine);
  const context = machine.context;

  const contextValue = { machine, context, send };

  return (
    <LibraryContext.Provider value={contextValue}>
      {machine.matches('logged_in') ? 
        <LibraryDesktop />
        :
        <LibraryLogin error='' />}
    </LibraryContext.Provider>
  );
}
