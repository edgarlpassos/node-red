var mqtt = require('mqtt')

var settings = {
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  keepalive: 1000, // sec
  lastWillTopic: 'raspberry/offline',
  lastWillMessage: 'Raspberry offline.',
  lastWillQos: 2,
  lastWillRetain: false,
  clientId: process.env.ID || 'invalid_id'
}

// client connection
var client = mqtt.connect('ws://34aa636e.ngrok.io', settings)

client.on('connect', () => {
	client.subscribe('hello/me')
})

// // client publishing a sample JSON
// client.publish('hello/you', '{ "hello": "you" }');

// client.on('message', (topic, message) => {
//   console.log('received', topic, message)
// })
// /**
//  * Want to notify controller that garage is disconnected before shutting down
//  */
// handleAppExit: (options, err) => {
//   if (err) {
//     console.log(err.stack)
//   }

//   if (options.cleanup) {
//     client.publish('garage/connected', 'false')
//   }

//   if (options.exit) {
//     process.exit()
//   }
// }
// /**
//  * Handle the different ways an application can shutdown
//  */
// process.on('exit', handleAppExit.bind(null, {
//   cleanup: true
// }))
// process.on('SIGINT', handleAppExit.bind(null, {
//   exit: true
// }))
// process.on('uncaughtException', handleAppExit.bind(null, {
//   exit: true
// }))