import React, { useState } from 'react'
import './Joke-search.css';
import { useMachine } from '@xstate/react';
import { jokesMachine } from './jokeMachine';

export default function JokeSearch() {
  const [{context, matches}, send] = useMachine(jokesMachine);

  const { results, error, input } = context;

  return (
    <div className='main'>
      <h2>Chuck Norris Jokes</h2>
      <p>Type a word phrase to look up for some jokes</p>
      <div className='search-bar'>
        <input 
          type='text' 
          name='name'
          value={input}
          onChange={(e) => send({type: 'TYPE', value: e.target.value})}
          />
        <button 
          type='button' 
          disabled={matches('seraching')}
          onClick={() => send('SEARCH')}>Search</button>
      </div>
      {matches('error') && <div className='error'>{error}</div>}
      <div className='jokes'>
        {results.map((joke, index)=>{return (
          <div key={joke.id}>
            <div  className='joke'>{joke.value}</div>
            <hr />
          </div>
        )})}
      </div>
    </div>
  )
}