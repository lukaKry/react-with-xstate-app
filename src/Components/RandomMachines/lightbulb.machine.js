const { createMachine, interpret, assign } = require('xstate');

const lb = createMachine({
  id: 'lightbulb',
  context: { color: '#fff', previouscolor: '' },
  initial: 'off',
  states: {
    on: {
      entry: [ 
        ()=>console.log('entered the on state')
      ],
      on: {
        BREAK: {
          target: 'broken',
        },
        TURN_OFF: {
          target: 'off'
        },
        CHANGE_COLOR: {
          actions: ['changingColor', 'changeColor']// uwaga, najpierw wykonują się akcje assign() na contexcie, a dopiero potem inne, to znaczy, że kolejność akcji po lewej 
          // będzie inna niż faktycznie byśmy tego oczekiwali (w kolejności wpisania do array actions) najpierw nastąpi wykonanie akcji changeColor ( bo to jest metoda assign context )
          // a dopiero w następnym kroku wykonana zostanie metoda changingColor
          // można to łatwo obejść dodając do kontekstu pole 'previous something' i zaraz na początku actions array dodać metodę assign, która przypisze obecny stan pola something do pola previous
        }
      }
    },
    off: {
      exit: [()=>console.log('exiting the off state...')],
      on: {
        BREAK: {
          target: 'broken',
        },
        TURN_ON: {target: 'on', actions: [()=>console.log('transition to on state')]},
        
      }
    },
    broken: {
      entry: ['logLocation', 'buyNewBulb'], 
      type: 'final'
    }
  }
},
{
  actions: {
    logBroken: () => console.log(`entered the broken state`),
    logLocation: (context, event) => console.log(`location: ${event.location}`),
    buyNewBulb: (context, event) => console.log(`Please, buy a new bulb`),
    changeColor: assign({color: (context,event) => event.color}),
    changingColor: (context) => console.log('changing color...' + context.previouscolor),
    assignPreviousColor: assign({previouscolor: (context) => context.color}),
  }
});

const service = interpret(lb).start();


service.send('TURN_ON');
console.log(service.state.context);

service.send({type: 'CHANGE_COLOR', color: '#f00'});
console.log(service.state.context);

 
