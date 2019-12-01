import axios from 'axios'
import { HOST } from "../variables"

const singleton = Symbol()
const singletonEnforcer = Symbol()

class Axios {
	constructor (enforcer) {
		if (enforcer !== singletonEnforcer) {
			throw new Error ('Cannot construct singleton');
		}

		this.session = axios.create ({
			headers: {
			},
			timeout: 300000,
			baseURL: `${HOST}/`,
		})
	}
	static get instance () {
		if (!this[singleton]) {
			this[singleton] = new Axios(singletonEnforcer)
		}
		return this[singleton]
	}

	get = (...params) => this.session.get(...params)
	post = (...params) => this.session.post(...params)
	put = (...params) => this.session.put(...params)
	delete = (...params) => this.session.delete(...params)
	patch = (...params) => this.session.patch(...params)
	head = (...params) => this.session.head(...params)
}

export default Axios.instance
