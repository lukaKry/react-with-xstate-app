import React from 'react';
import './traffic-light.css';
import { useMachine } from '@xstate/react';
import { trafficLightMachine } from './trafficLightMachine';



export default function TrafficLight() {
  const [current, send] = useMachine(trafficLightMachine);

  return (
    <div className="wrapper">
      <div className='trafic-lights'>
        <div className={current.matches({ON: 'red'}) ? 'circle red active' : 'circle red'}></div>
        <div className={current.matches({ON: 'yellow'}) ? 'circle yellow active' : 'circle yellow'}></div>
        <div className={current.matches({ON: 'green'}) ? 'circle green active' : 'circle green'}></div>
        <button type='button' onClick={() => send('NEXT')}>Next</button>
        <button type='button' onClick={() => send('TURN_ON')}>ON</button>
        <button type='button' onClick={() => send('TURN_OFF')}>OFF</button>
      </div>
    </div>
  );
}
