const mosca = require('mosca')
const register = require('./model/register')

const settings = {
	port:1883,
	http: {
		port: 1080,
		bundle: true,
		static: './'
	}
}

const server = new mosca.Server(settings)

server.on('ready', () => {
	console.log('Broker is ready!')
})

server.on('clientConnected', (client) => {
	console.log('client connected', client.id)
})

server.on('clientDisconnected', (client) => {
	console.log('client disconnected', client.id)
})

// fired when a message is published
server.on('published', (packet, client) => {
	console.log('Published', packet.payload)
})

var message = {
  topic: 'hello/me',
  payload: 'abcde', // or a Buffer
  qos: 0, // 0, 1, or 2
  retain: false // or true
}

// setTimeout(() => {
// 	server.publish(message, () => {
// 	  console.log('done!')
// 	})
// }, 5000)	