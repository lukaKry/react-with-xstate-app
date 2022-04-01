const { createMachine, interpret, send } = require('xstate');

const idleMachine = createMachine({
  id: 'idleMachine',
  initial: 'idle',
  states: {
    idle: {
      entry: () => console.log('entering'),
      exit: () => console.log('exiting'),
      activities: 'raporting',
      on:{
        TURN_OFF: 'off'
      }
    },
    off: {},
  },
  on: {
    DO_NOTHING: {target: '.idle', actions: send('CONFIRM_DO_NOTHING')},
    CONFIRM_DO_NOTHING: { actions: ()=> console.log('echo echo')}
  }
},{
  activities: {
    raporting: (context, event) => {
      const beep = () => console.log('beep');

      beep();
      const intervalID = setInterval( beep, 1000);

      return () => clearInterval(intervalID);
    }
  }
});

const service = interpret(idleMachine).start();

service.send('DO_NOTHING');
service.send('DO_NOTHING');

setTimeout(()=>{
  service.send('TURN_OFF');
},5000);