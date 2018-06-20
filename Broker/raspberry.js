var mqtt = require('mqtt')

const id = process.argv[2]
const brokerIp = process.argv[3]
const brokerPort = process.argv[4]

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
    console.log('sending message');
	client.subscribe('raspberry/all');
    client.publish('raspberry/all', 'RPi connected: ' + settings.clientId);
})
