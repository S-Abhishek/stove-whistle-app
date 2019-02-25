const EventEmitter = require('event-emitter');
const client = new WebSocket('ws://echo.websocket.org:80');

var messageEvents = new EventEmitter();


client.on( 'open', connection => {
    console.log( new Date().toISOString() + ' Connected');
    messageEvents.on('sendmsg', msg => {
        client.send(msg);
    });

    messageEvents.emit('sendmsg','{"action": "whistle", "data" : "increment"}');
});

client.on('message', msg => {
    try{
        msg = JSON.parse(msg);
        let action = msg.action;
        let data = msg.data;
        console.log(new Date().toISOString() + ' Recieved '+ action +' : ' + data);
        messageEvents.emit(action, data);
    }
    catch(err){

    }
});