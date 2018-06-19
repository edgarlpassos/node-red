const Store = require('data-store')
const store = new Store('data', { path: 'data/data.json' })

module.exports = {
	addRaspberry: (id, body) => {
		store.set(id, body)
	},
	removeRaspberry: (id) => {
		store.del(id)
	},
	getRaspeberry: (id) => {
		return store.get(id)
	},
	checkRaspberry: (id) => {
		return store.has(id)
	},
	getRaspberrys: () => {
		return store.data
	}
}