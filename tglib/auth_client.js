'use strict'

const TDLib = require('./auth')

class Client extends TDLib {
	constructor(options = {}) {
		super(options)
	} 

	async getMe() {
		return this.request('getMe')
	}

    async getOption(name){
        return this.request('getOption',{
            name
        })
    }

    async setOption(name,value){
        return this.request('setOption',{
            name,
            value: { '@type':'optionValueBoolean', value }
        })
    }


    async ignore_background_updates(value){
        return this.request('setOption',{
            name:'ignore_background_updates',
            value: { '@type':'optionValueBoolean', value }
        })
    }

    /**
     * @param {string} text 
     * @param {string} type text|markdown|html 
     */
    async parseTextEntities(text, type = 'text') {
        switch (type.toLowerCase()) {
            case 'markdown':
                return this.request('parseTextEntities', {text: text, parse_mode: {'@type': 'textParseModeMarkdown'} })
            case 'html':
                return this.request('parseTextEntities', {text: text, parse_mode: {'@type': 'textParseModeHTML'} })
            default:
                return {text}
        }
    }
}

module.exports = Client