var mqtt = require('mqtt')
var { Joystick, Leds } =  require('node-sense-hat')
var { StringDecoder } = require("string_decoder");

//**** RPi led constants

const w = [255, 255, 255]   // white
const x = [0, 0, 0]         // black
const r = [255, 0, 0]        // red]
const g = [0, 255, 0]       // green
const b = [0, 0, 255]       // blue

const cross = [
    w, w, r, r, r, r, w, w,
    w, w, w, r, r, w, w, w,
    r, w, w, w, w, w, w, r,
    r, r, w, w, w, w, r, r,
    r, r, w, w, w, w, r, r,
    r, w, w, w, w, w, w, r,
    w, w, w, r, r, w, w, w,
    w, w, r, r, r, r, w, w,
]

const check = [
    g, g, g, g, g, g, g, g,
    g, g, g, g, g, g, g, g,
    g, g, g, g, g, g, g, g,
    g, g, g, g, g, g, g, g,
    g, g, g, g, g, g, g, g,
    g, g, g, g, g, g, g, g,
    g, g, g, g, g, g, g, g,
    g, g, g, g, g, g, g, g,
]

//**** rPi Joystick functions
Joystick.getJoystick()
    .then((joystick) => {
        joystick.on('press', (direction) => {
            switch (direction) {
                case 'up':
                    client.publish('raspberry/' + settings.clientId, 'LED RED');
                    break;
                case 'right':
                    client.publish('raspberry/' + settings.clientId, 'LED GREEN');
                    break;
                case 'left':
                    client.publish('raspberry/' + settings.clientId, 'LED WHITE');
                    break;
                case 'down':
                    client.publish('raspberry/' + settings.clientId, 'LED BLUE');
                    break;
                case 'click':
                    client.publish('raspberry/' + settings.clientId, 'LED CLEAR');
                    break;
                default:
                    break;
            }
        });
    });

const id = process.argv[2]
const brokerIp = process.argv[3]
const brokerPort = process.argv[4]

Leds.clear(x);
Leds.setPixels(check);

var settings = {
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    keepalive: 1000, // sec
    lastWillTopic: 'raspberry/offline',
    lastWillMessage: 'OFFLINE ' + id,
    lastWillQos: 2,
    lastWillRetain: false,
    clientId: id
}

console.log('mqtt://' + brokerIp + ':' + brokerPort + '/');
// client connection
var client = mqtt.connect('mqtt://' + brokerIp + ':' + brokerPort + '/', settings)

client.on('connect', () => {
    client.subscribe('raspberry/all');
    client.publish('raspberry/all', 'RPi connected: ' + settings.clientId);
    Leds.showMessage('CONNECTED', () => Leds.setPixels(check));
})

client.on('message', function (topic, message) {
    var parsedMessage = new StringDecoder("utf-8").write(message);
    console.log(topic);
    console.log(parsedMessage);
    var messageContent = parsedMessage.toString().split(' ');

    switch(topic) {
        case 'raspberry/all':
            parseBroadcast(messageContent);
            break;
        default:
            parseSubscriptionContent(messageContent);
            break;
    }
});

function parseBroadcast(content) {
    var command = content[0].trim();
    switch (command) {

        case 'SUBSCRIBE':
            if (content[1].trim() === settings.clientId) {
                var deviceName = content[2].trim();
                client.subscribe('raspberry/' + deviceName);
                Leds.showMessage('Subscribed to ' + deviceName, () => Leds.setPixels(check));
            }
            break;
        
        case 'UNSUB':
            if (content[1].trim() === settings.clientId) {
                var deviceName = content[2].trim();
                client.unsubscribe('raspberry/' + deviceName);
                Leds.showMessage('Unsubscribed from ' + deviceName, () => Leds.clear());
            }
            break;
        case 'DISCONNECT':
            if (content[1].trim() === settings.clientId) {
                client.end()
                Leds.showMessage('Disconnecting', () => Leds.clear(x));
            }
            break;
        default:
            break;
    }
}

function parseSubscriptionContent(content) {
    var command = content[0].trim();

    switch(command) {
        case 'LED':
            parseLedInstruction(content[1].trim());
            break;
        default:
            break;
    }
}

function parseLedInstruction(instruction) {
    switch (instruction) {
        case 'RED':
           Leds.clear(r);
           break; 
        case 'BLUE':
           Leds.clear(b);
           break; 
        case 'GREEN':
           Leds.clear(g);
           break; 
        case 'WHITE':
           Leds.clear(w);
           break; 
        case 'CLEAR':
           Leds.clear(x);
           break; 
        default:
           break;
    }
}
