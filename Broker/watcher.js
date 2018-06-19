var mqtt = require('mqtt')

var settings = {
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  keepalive: 1000, // sec
  lastWillTopic: 'watcher/offline',
  clientId: process.env.ID || 'invalid_id'
}

// client connection
var client = mqtt.connect('mqtt://localhost:1883', settings)

console.log(client);

client.on('connect', () => {
	client.subscribe('raspberry/offline')
})

client.on('message', (topic, message) => {
   console.log('received', topic, message)
})