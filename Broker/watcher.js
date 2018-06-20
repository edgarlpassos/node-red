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

client.on('connect', () => {
	client.subscribe('raspberry/offline')
    client.publish('raspberry/offline', 'Hello, m8s');
})

client.on('message', (topic, message) => {
   console.log('received', topic, message)
})
