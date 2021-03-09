'use strict'

const TDLib = require('./tdlib')

class Client extends TDLib {
	constructor(options = {}) {
		super(options)
	} 

	async searchPublicChat(username) {
		return this.request('searchPublicChat', {
			username: username
		})
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

	async getMe() {
		return this.request('getMe')
	}

	async getUser(id) {
		return this.request('getUser', {
			user_id: id
		})
	}

	async getSupergroupFullInfo(supergroup_id){
		return this.request('getSupergroupFullInfo', {
			supergroup_id
		})
	}

	async getChat(id) {
		return this.request('getChat', {
			chat_id: id
		})
	}

	async getChats() {
		return this.request('getChats', {
			offset_order: '9223372036854775807',
			offset_chat_id: 0,
			limit: Math.floor(Math.random() * 9999999)
		})
	}

	async deleteChatHistory(id) {
		return this.request('deleteChatHistory', {
			chat_id: id, 
			remove_from_chat_list: true
		})
	}

	async openChat(id) {
		return this.request('openChat', {
			chat_id: id
		})
	}

	async closeChat(id) {
		return this.request('closeChat', {
			chat_id: id
		})
	}

	async _deleteChatMember(chat_id, user_id) {
		return this.request('setChatMemberStatus', {
			chat_id: chat_id,
			user_id: user_id,
			status: {'@type': 'chatMemberStatusLeft'}
		})
	}

	async getSupergroupMembers(supergroup_id, offset = 0, limit = 200) {
		
		return this.request('getSupergroupMembers', { supergroup_id, offset, limit })
	}


	async getChatMember(chat_id,user_id) {

		return this.request('getChatMember', { chat_id, user_id })
	}

	async _deleteChat(id) {
		const chat = await this.getChat(id)
		switch (chat.type['@type']) {
			case 'chatTypeBasicGroup':
			case 'chatTypeSupergroup':
			  	const { id: user_id } = await this.getMe()
			  	await this._deleteChatMember(id, user_id)
			break
			case 'chatTypeSecret':
				await this.request('closeSecretChat', {secret_chat_id: chat.type.secret_chat_id})
				await this.deleteChatHistory(id)
			break
			default:
				await this.closeChat(id)
				await this.deleteChatHistory(id)
		}
	}

	async createPrivateChat(id) {
		return this.request('createPrivateChat', {
			user_id: id,
			force:true
		})
	}

	async getMessage(chat_id, message_id) {
		return this.request('getMessage', {
			chat_id: chat_id, 
			message_id: message_id
		})
	}

	async getMessages(chat_id, message_ids = []) {
		return this.request('getMessages', {
			chat_id: chat_id, 
			message_ids: message_ids
		})
	}

	async searchChatMessages(chat_id, sender_user_id, from_message_id, limit) {
		return this.request('searchChatMessages', {
			chat_id, 
			sender_user_id,
			from_message_id,
			limit
		})
	}

	async forwardMessages(chat_id, from_chat_id, message_ids = []) {
		return this.request('forwardMessages', {
			chat_id,
			from_chat_id,
			message_ids,
			as_album: true
		})
	}

    async sendMessage(chat_id, text, type = 'text') {
        return await this.request('sendMessage', {
            chat_id: chat_id, 
            reply_to_message_id: 0, 
            disable_notification: false, 
			from_background: true, 
            input_message_content: {
				'@type': 'inputMessageText', 
				text: await this.parseTextEntities(text, type), 
				disable_web_preview: true, 
				clear_draft: true
			}
        })
    }

    async sendMedia(chat_id, photo, caption = ''){
		return this.request('sendMessage', {
            chat_id: chat_id, 
            reply_to_message_id: 0, 
            disable_notification: false, 
			from_background: true, 
            input_message_content: {
				'@type': 'inputMessagePhoto', 
				photo: {
					'@type': 'inputFileLocal', 
					path: photo
				}, 
				caption:{
					'@type': 'formattedText', 
					text: caption
				} 
			}
        })
    }

    async sendMessageAlbum(chat_id,photos = [],caption = ''){

    	const text = await this.parseTextEntities(caption, 'html')

    	const input_message_contents = photos.map((item,key)=>{
    		return { 
    			'@type': 'inputMessagePhoto', 
				photo: {
					'@type': 'inputFileLocal', 
					path: item
				}, 
				caption:{
					'@type': 'inputMessageText', 
					text: text//!key?caption:''
				}
			}
    	})
    	return this.request('sendMessageAlbum', {
            chat_id, 
            input_message_contents,
            reply_to_message_id: 0, 
        })
    }

    async joinChat(chat_id){
    	return this.request('joinChat', {
    		chat_id: chat_id
    	})
    }

	async addChatMember(chat_id, user_id,forward_limit=0) {
		return this.request('addChatMember', {
			chat_id: chat_id, 
			user_id: user_id,
			forward_limit:forward_limit
		})
	}

	async getStorageStatistics(chat_limit = 0) {
		return this.request('getStorageStatistics', {
			chat_limit
		})
	}

	async optimizeStorage() {
		return this.request('optimizeStorage', {
			size:-1,
			ttl:-1,
			count:-1,
			immunity_delay:-1,
			chat_limit:0
		})
	}

	async getCallbackQueryAnswer(chat_id,message_id,data) {
		return this.request('getCallbackQueryAnswer', {
			chat_id,
			message_id,
			payload: { 
				'@type': 'callbackQueryPayloadData', 
				data
			}
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
