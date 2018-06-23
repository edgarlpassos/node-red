var mqtt = require('mqtt')
var leds = require('node-sense-hat').Leds

//**** RPi led constants

const w = [255, 255, 255]   // white
const x = [0, 0, 0]         // black
const r = [255, 0, 0]        // red]
const g = [0, 255, 0]       // green
const b = [0, 0, 255]       // blue

const cross = [
    w, w, r, r, r, r, w, w,
    w, w, w, r, r, r, w, w,
    r, w, w, w, r, w, w, r,
    r, r, w, w, w, w, w, r,
    r, r, w, w, w, w, r, r,
    r, w, w, w, w, w, w, r,
    w, w, w, r, r, w, w, w,
    w, w, r, r, r, r, w, w,
]

const id = process.argv[2]
const brokerIp = process.argv[3]
const brokerPort = process.argv[4]

leds.clear(x);
leds.setPixels(cross);

var settings = {
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    keepalive: 1000, // sec
    lastWillTopic: 'raspberry/offline',
    lastWillMessage: 'Raspberry offline.',
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
})

client.on('message', function (topic, message) {
    switch(topic) {
        case 'raspberry/all':
            var messageContent = message.split(' ');
            if (messageContent[2] === this.client.id) {
                parseBroadcast(messageContent);
            }
            break;

        default:
            break;
    }
});

function parseBroadcast(content) {
    var command = content[0].trim();
    switch (command) {

        case 'SUBSCRIBE':
            if (content[1].trim() === settings.clientId) {
                client.subscribe('raspberry/' + deviceName);
            }
            break;

        default:
            break;
    }
}
