import React, { useContext } from 'react';
import { fetchMachine } from './Machines/fetch.machine';
import { useActor, useMachine } from '@xstate/react';
import Loading from './SwLoading';
import SwResults from './SwResults';
import SwError from './SwError';
import SwButton from './SwButton';
import { StarWarsContext } from './StarWarsContext';

const style= {
  width: '100vh',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const responseObject = [
    { name: 'Name', alias: 'alias'},
    { name: 'Name2', alias: 'alias2'},
    { name: 'Name3', alias: 'alias3'},
  ]

const fetchPeople = () => {
  return new Promise<any>( (resolve,reject) => {
    console.log('fetching results...');
    setTimeout(()=>{
      const rand = Math.random();
      if ( rand > 0.5 ) {
        resolve(responseObject);
      } else {
        reject('500 ERROR! Please contact somebody who is wise enough to solve that problem');
      }
    },1000);
})}

export default function StarWars() {
  const [fetchState, sendToFetchMachine] = useMachine(fetchMachine, 
    {
    actions: {
      fetchData: (context, event) => {
        fetchPeople()
          .then(
            response => {
              sendToFetchMachine({type: 'RESOLVE', results: response});
            },
            message => {
              sendToFetchMachine({type: 'REJECT', message: message})
            }
          );
      },
    }
  }
  );

  const handleFetch = () => {
    sendToFetchMachine('FETCH');
  }

  const StarWars_Service: any = useContext(StarWarsContext);
  const [state]: any = useActor(StarWars_Service.starWarsService)

  console.log(state.matches('idle'));
  

  console.log('StarWars: rendering...');
  
  return (
      <div className='star-wars'>
        <SwButton fetch={handleFetch} />
        {fetchState.matches('pending') && <Loading />}
        {fetchState.matches('successful') && <SwResults results={fetchMachine.context.results} />}
        {fetchState.matches('failed') && <SwError error={fetchMachine.context.message} />}
      </div>
  )
}

// korzystanie z useMachine jest spoko do momentu, kiedy nie chcemy przekazywać czegokolowiek do children components
// jeśli tylko korzystamy z kodu jak poniżej, to fajnie działa... ale już przekazanie props do komponentu child nie działa...
{/* <div style={style}>{fetchState.context.message}</div> */}